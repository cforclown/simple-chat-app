import { IMessage } from 'chat-app.contracts';
import { callProtectedMainAPI, getAPIEndpoint } from '@/utils/call-api';
import { IChannel } from '@/store/reducers/channels';

export const getChannels = () => callProtectedMainAPI(getAPIEndpoint('/channels'));
export const startConversation = (receiver: string, text: string): Promise<IChannel> => callProtectedMainAPI(
  getAPIEndpoint('/messages/start', 'POST'), 
  { receiver, text }
);

export const getChannelMsgs = (channel: string): Promise<IMessage[]> => callProtectedMainAPI(getAPIEndpoint(`/messages/${channel}`));

export interface ISendMsgPayload {
  channel: string;
  text: string;
}

export const sendMsg = ({ channel, text }: ISendMsgPayload) => callProtectedMainAPI(
  getAPIEndpoint(`/messages/${channel}`, 'PUT'),
  { text }
);

export const readMsgs = (channel: string) => callProtectedMainAPI(getAPIEndpoint(`/messages/read/${channel}`, 'PATCH'));
