import Joi from 'joi';
import { IUser } from './users';
import { IMessage } from './messages';

export enum EChannelRoles {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member'
}

export interface IChannelUserRole {
  user: string; // user id
  role: EChannelRoles;
}

export const channelTypes = ['dm', 'group'] as const;
export type ChannelsTypes = typeof channelTypes[number];
export const isValidChannelType = (channelType: string): channelType is ChannelsTypes => channelTypes.includes(channelType as ChannelsTypes);

export interface IChannelRaw {
  id: string;
  name?: string; // only when type==='group'
  type: ChannelsTypes;
  desc?: string;
  users: string[]; // list of user id (channel members)
  roles?: IChannelUserRole[]; //  undefined if type==='dm'
  messages: IMessage[];
  createdAt?: Date;
  updatedAt?: Date;
  archived?: boolean;
}

export interface IChannel<T extends IUser | string = string> extends Omit<IChannelRaw, 'users' | 'messages'> {
  users: T[];
  unreadMessages?: number;
  lastMessage?: string;
}

export interface ICreateDmChannelReq {
  type: 'dm';
  users: [string, string];
}

export interface ICreateGroupChannelReq {
  type: 'group';
  users: string[]; // list of user id (group member)
  roles: IChannelUserRole;
}

export interface IUpdateChannelReq {
  id: string;
  name?: string;
  desc?: string;
  users?: string[];
  roles?: Array<{
    user: string,
    role: EChannelRoles,
  }>;
}

export interface ICreateGroupReq {
  name: string;
  desc?: string;
  users: string[];
  roles: Array<{
    user: string,
    role: EChannelRoles,
  }>;
}

export const createGroupReqSchema = Joi.object<ICreateGroupReq>({
  name: Joi.string().required(),
  desc: Joi.string().allow('').default(null),
  users: Joi.array().items(Joi.string()).required(),
  roles: Joi.array().items(Joi.object({
    user: Joi.string().required(),
    role: Joi.string().allow(EChannelRoles).required()
  })).required()
});

export interface IUpdateGroupReq {
  name?: string;
  desc?: string;
  roles?: Array<{
    user: string,
    role: EChannelRoles,
  }>;
}

export const updateGroupReqSchema = Joi.object<IUpdateGroupReq>({
  name: Joi.string(),
  desc: Joi.string(),
  roles: Joi.array().items(Joi.object({
    user: Joi.string().required(),
    role: Joi.string().allow(EChannelRoles).required()
  }))
});

export const channelsSwagger = {
  createGroup: {
    type: 'object',
    properties: {
      name: { type: 'string', required: true },
      desc: { type: 'date' },
      users: { type: 'array', items: 'string', required: true },
      roles: {
        type: 'object',
        properties: {
          user: { type: 'string', required: true },
          role: { type: 'string', enum: ['owner', 'admin', 'member'], required: true }
        }
      }
    }
  },
  upgradeGroup: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      desc: { type: 'string' },
      roles: {
        type: 'object',
        properties: {
          user: { type: 'string', required: true },
          role: { type: 'string', enum: ['owner', 'admin', 'member'], required: true }
        }
      }
    }
  }
};
