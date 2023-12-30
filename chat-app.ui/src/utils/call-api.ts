import axios, { AxiosRequestConfig, HttpStatusCode } from 'axios';
import { IUserContext } from 'chat-app.contracts';
import { API_ENDPOINT } from './environment';
import store, { IAppState } from '@/store';
import { deleteUserContext, setUserContext } from '@/store/reducers/user-context';

export enum HTTPStatusCodes {
  Ok = 200,
  BadRequest = 400,
  NotFound = 404,
  Unauthorized = 401,
  Forbidden = 403,
  Internal = 500,
  BadGateway = 502,
  ServiceUnavailable = 503,
}

export class CallAPIException extends Error {
  status: number;

  headers?: any;

  constructor(message: string, status = HTTPStatusCodes.BadRequest, headers = undefined) {
    super(message);
    this.status = status;
    this.headers = headers;
  }
}

export type IAPIEndpointMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS'

export interface IAPIEndpoint {
  url: string;
  method?: IAPIEndpointMethod;
  headers?: Record<string, any>;
}

export const getAPIEndpoint = (path: string, method?: IAPIEndpointMethod, header?: Record<string, any>): IAPIEndpoint => ({
  url: API_ENDPOINT + path,
  method,
  headers: header,
});

export const getAuthEndpoint = (
  path: string, 
  method?: IAPIEndpointMethod, 
  header?: Record<string, any>
): IAPIEndpoint => getAPIEndpoint(`/auth${path}`, method, header);

export interface IAxiosFetchArgs {
  url: string;
  body?: any;
  config?: AxiosRequestConfig;
}

export const AxiosFetch = {
  GET: (args: IAxiosFetchArgs): Promise<any> => axios.get(args.url, args.config),
  POST: (args: IAxiosFetchArgs): Promise<any> => axios.post(args.url, args.body, args.config),
  PUT: (args: IAxiosFetchArgs): Promise<any> => axios.put(args.url, args.body, args.config),
  PATCH: (args: IAxiosFetchArgs): Promise<any> => axios.patch(args.url, args.body, args.config),
  DELETE: (args: IAxiosFetchArgs): Promise<any> => axios.delete(args.url, args.config),
  OPTIONS: (args: IAxiosFetchArgs): Promise<any> => axios.options(args.url, args.config)
};

export const axiosFetch = (endpoint: IAPIEndpoint, body: any): Promise<any> => {
  const config = Object.assign({ withCredentials: true }, endpoint.headers ? { headers: endpoint.headers } : {}) ;
  return AxiosFetch[endpoint.method ?? 'GET']({
    url: endpoint.url,
    body,
    config
  });
};

export interface ICallApiResponse<T> {
  data?: T;
  error?: Error | CallAPIException | undefined;
}

// there will be multiple api fetch handler
export const axiosFetchHandler = async <T>(endpoint: IAPIEndpoint, body?: any): Promise<T> => {
  try {
    const response = await axiosFetch(endpoint, body);
    return response.data as T;
  } catch (err: any) {
    if (err.response) { // Request made and server responded
      const { error } = err.response.data;
      throw new CallAPIException(error, err.response.status, err.response.headers);
    } else if (err.request) { // The request was made but no response was received
      throw new CallAPIException('Server is not responding', HTTPStatusCodes.BadGateway);
    }

    // Something happened in setting up the request that triggered an Error
    throw err;
  }
};

export const callApi = async <T>(endpoint: IAPIEndpoint, body?: any, fetchHandler?: (endpoint: IAPIEndpoint, body?: any) => Promise<any>): Promise<T> => {
  const data = fetchHandler ? await fetchHandler(endpoint, body) : await axiosFetchHandler(endpoint, body);
  return data as T;
};

export interface IMainAPIResponse<T> {
  data?: T;
  error?: string;
}

export const callMainAPI = async <T>(endpoint: IAPIEndpoint, body?: any): Promise<T> => {
  const { data: responseBody } = await callApi<IMainAPIResponse<T>>(endpoint, body);
  return responseBody as T;
};

export const callProtectedMainAPI = async <T>(endpoint: IAPIEndpoint, body?: any, autoRefreshAccessToken = true): Promise<T> => {
  try {
    const accessToken = (store.getState() as IAppState).userContext.context?.accessToken;
    const refreshToken = (store.getState() as IAppState).userContext.context?.refreshToken;
    if (!accessToken) {
      throw new CallAPIException('User is not logged in', HTTPStatusCodes.Unauthorized);
    }
    
    endpoint.headers = Object.assign(endpoint.headers ?? {}, {
      Authorization: `Bearer ${accessToken}`,
    });
  
    try {
      const data = await callMainAPI<T>(endpoint, body);
      return data;
    } catch (err) {
      if (err instanceof CallAPIException && err.status === HttpStatusCode.Unauthorized && autoRefreshAccessToken && refreshToken) {
        const newToken = await getNewToken(accessToken, refreshToken);
        store.dispatch(setUserContext(newToken));
        return callProtectedMainAPI(endpoint, body, false);
      }

      throw err;
    }
  } catch (err ){
    if (err instanceof CallAPIException && err.status === HTTPStatusCodes.Unauthorized) {
      store.dispatch(deleteUserContext());
      throw err;
    }

    throw err;
  }
};

export const getNewToken = async (accessToken: string, refreshToken: string): Promise<IUserContext> => callMainAPI<IUserContext>(
  getAuthEndpoint(
    '/refresh', 
    'POST',
    { Authorization: `Bearer ${accessToken}` }
  ), { refreshToken }
);
