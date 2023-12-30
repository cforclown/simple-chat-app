
import { createSlice } from '@reduxjs/toolkit';
import { IUser, IChannel as IChannelUser } from 'chat-app.contracts';

export enum EChannelRoles {
  OWNER='owner',
  ADMIN='admin',
  MEMBER='member'
}

export interface IChannel extends IChannelUser<IUser> {}

export interface IChannelsState {
  loading: boolean;
  channels: IChannel[];
  selectedChannel?: IChannel;
}

const channelsInitialState: IChannelsState = {
  loading: true,
  channels: [],
};


const channelsSlice = createSlice({
  name: 'channels',
  initialState: channelsInitialState,
  reducers: {
    setChannelsLoading(state, { payload }) {
      state.loading = payload;
    },
    setChannels(state, { payload }) {
      state.channels = payload;
    },
    setSelectedChannel(state, { payload }) {
      state.selectedChannel = payload;
    }
  }
});

export const { 
  setChannelsLoading, 
  setChannels,
  setSelectedChannel
} = channelsSlice.actions;

export default channelsSlice.reducer;
