
import { createSlice } from '@reduxjs/toolkit';
import { IMessage } from 'chat-app.contracts';

export interface IMessagesState {
  loading: boolean;
  msgs: IMessage[];
}

const msgsInitialState: IMessagesState = {
  loading: true,
  msgs: []
};


const msgsSlice = createSlice({
  name: 'messages',
  initialState: msgsInitialState,
  reducers: {
    setMsgsLoading(state, action) {
      state.loading = action.payload;
    },
    setMsgs(state, action) {
      state.msgs = action.payload;
    },
    pushMsg(state, action) {
      state.msgs.push(action.payload);
    }
  }
});

export const { 
  setMsgsLoading, 
  setMsgs,
  pushMsg 
} = msgsSlice.actions;

export default msgsSlice.reducer;
