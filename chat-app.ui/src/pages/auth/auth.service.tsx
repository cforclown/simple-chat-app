import { ILoginReq, IRegisterUserReq, IUserContext } from 'chat-app.contracts';
import { callMainAPI, getAuthEndpoint } from '@/utils/call-api';
import { IMetadataField } from '@/utils/metadata';

export const signinFields: IMetadataField<any>[] = [
  {
    accessorKey: 'email',
    label: 'Email',
    type: {
      value: 'STRING',
      required: true
    }
  },
  {
    accessorKey: 'password',
    label: 'Password',
    type: {
      value: 'STRING',
      required: true
    }
  }
];

export const signin = (credentials: ILoginReq): Promise<IUserContext> => callMainAPI(
  getAuthEndpoint('/login', 'POST'),
  credentials,
);

export const signup = (payload: IRegisterUserReq): Promise<IUserContext> => callMainAPI(
  getAuthEndpoint('/register', 'POST'),
  payload,
);

interface IValidateAccessTokenPayload { 
  accessToken: string, 
  refreshToken: string 
}
export const validateAccessToken = (
  { accessToken, refreshToken }: IValidateAccessTokenPayload
): Promise<true | IUserContext> => callMainAPI(
  getAuthEndpoint(
    '/validate', 
    'PUT', 
    { Authorization: `Bearer ${accessToken}` }
  ),
  { refreshToken },
);
