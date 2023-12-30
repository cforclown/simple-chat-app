import { IUserContext } from 'chat-app.contracts';
import storageService from '@/utils/storage-service';
import { createSlice } from '@reduxjs/toolkit';

export interface IUserContextState {
  context?: IUserContext;
}

export const userContextInitialState: IUserContextState = {};

export const USER_CONTEXT_STORAGE_KEY = 'user-context';


const userContextSlice = createSlice({
  name: 'userContext',
  initialState: userContextInitialState,
  reducers: {
    setUserContext(state, action) {
      state.context = {
        ...action.payload
      };
      storageService('local').setObject(USER_CONTEXT_STORAGE_KEY, action.payload);
    },
    deleteUserContext(state) {
      state.context = undefined;
      storageService('local').remove(USER_CONTEXT_STORAGE_KEY);
    }
  }
});

export const { 
  setUserContext, 
  deleteUserContext
} = userContextSlice.actions;

export default userContextSlice.reducer;
