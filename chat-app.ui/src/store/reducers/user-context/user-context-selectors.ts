import { IUserContext } from 'chat-app.contracts';
import { IAppState } from '@/store';

export const selectUserContext = (): (state: IAppState) => IUserContext | undefined => (state: IAppState) => state.userContext.context;
