import { Types } from 'mongoose';
import {
  EChannelRoles,
  IChannel,
  ICreateDmChannelReq,
  ICreateGroupReq,
  IMessage,
  IUpdateGroupReq
} from 'chat-app.contracts';
import { mockUser } from './mock-users-data';

const mockObjectId1 = new Types.ObjectId();
export const mockChannelDm1: IChannel = {
  id: mockObjectId1.toString(),
  name: 'channel name',
  type: 'dm',
  desc: 'mock channel desc',
  users: [mockUser]
};

const mockObjectId2 = new Types.ObjectId();
export const mockChannelDm2: IChannel = {
  id: mockObjectId2.toString(),
  name: 'channel name',
  type: 'dm',
  desc: 'mock channel desc',
  users: [mockUser]
};

export const mockChannelGroup: IChannel = {
  id: mockObjectId1.toString(),
  name: 'channel name',
  type: 'group',
  desc: 'mock channel desc',
  users: [mockUser]
};

export const mockCreateChannelDmReq: ICreateDmChannelReq = {
  type: 'dm',
  users: [new Types.ObjectId().toString(), new Types.ObjectId().toString()]
};

export const mockCreateGroupPayload: ICreateGroupReq = {
  name: 'channel name',
  desc: 'mock channel desc',
  users: [mockUser.id],
  roles: [{
    user: mockUser.id as string,
    role: EChannelRoles.OWNER
  }]
};

export const mockUpdateChannelPayload: IUpdateGroupReq = {
  name: 'channel name',
  desc: 'mock channel desc'
};

export const mockUpdateGroupPayload: IUpdateGroupReq = {
  name: 'channel name',
  desc: 'mock channel desc'
};

const msgId = new Types.ObjectId();

export const mockMsg: IMessage = {
  id: msgId.toString(),
  channel: mockChannelDm1.id,
  sender: mockUser.id,
  text: 'mock message text',
  createdAt: new Date()
};

export const mockMsgRes: IMessage = {
  id: msgId.toString(),
  channel: mockChannelDm1.id,
  sender: mockUser.id,
  text: 'mock message text',
  createdAt: new Date('2023-12-18T12:31:18.260Z')
};
