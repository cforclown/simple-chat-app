/* eslint-disable no-console */
import { useRef, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { HttpStatusCode } from 'axios';
import { useDispatch } from 'react-redux';
import { IUserContext } from 'chat-app.contracts';
import { CallAPIException, IMainAPIResponse } from '@/utils/call-api';
import { setUserContext } from '@/store/reducers/user-context';
import { SOCKETIO_ENDPOINT } from '@/utils/environment';

export type IEventResponseWrapper<T> = IMainAPIResponse<T>

export type ISocketIOEventCallback<T> =(data?: IEventResponseWrapper<T>) => void | Promise<void>

export const socketEvent = <T>(
  callback: ISocketIOEventCallback<T>,
  loadingSetter?: (current: boolean) => void,
) => async (data?: IEventResponseWrapper<T>) => {
    try {
      loadingSetter?.(true);
      callback(data);
    } catch (err: any) {
      console.error(err);
      if (err instanceof CallAPIException && err.status !== HttpStatusCode.Unauthorized) {
        toast.error(err.message);
      }
    } finally {
      loadingSetter?.(false);
    }
  };

function useSocketIOClient(userContext: IUserContext): [socket: Socket, connected: boolean] {
  const navigate = useNavigate();
  const socket = useRef(io(SOCKETIO_ENDPOINT, {
    auth: {
      accessToken: userContext.accessToken,
      refreshToken: userContext.refreshToken
    },
    autoConnect: false
  }));
  const dispatch = useDispatch();
  const [ connected, setConnected ] = useState(false);
  const hasConnectedRef = useRef(false);

  useEffect(() => {
    socket.current.auth = {
      accessToken: userContext.accessToken,
      refreshToken: userContext.refreshToken
    };
    if (socket.current.connected) {
      socket.current.disconnect();
      socket.current.connect();
    }
  }, [ userContext ]);

  socket.current.on('connect', () => {
    console.info('Socket connected');
    hasConnectedRef.current = true;
    setConnected(true);
  });
  
  socket.current.on('disconnect', () => {
    // console.error('Socket disconnected');
    setConnected(false);
  });

  socket.current.on('connect_error', () => {
    if (hasConnectedRef.current) {
      return;
    }
    navigate('/auth/signin');
  });

  socket.current.on('new-access-token', (data) => {
    if (!data || !data.data) {
      return;
    }
    dispatch(setUserContext(data.data));
  });

  return [
    socket.current,
    connected
  ];
}

export default useSocketIOClient;
