import Joi from 'joi';
import { IUser } from './users';
import { IMessage } from './messages';
export declare enum EChannelRoles {
    OWNER = "owner",
    ADMIN = "admin",
    MEMBER = "member"
}
export interface IChannelUserRole {
    user: string;
    role: EChannelRoles;
}
export declare const channelTypes: readonly ["dm", "group"];
export type ChannelsTypes = typeof channelTypes[number];
export declare const isValidChannelType: (channelType: string) => channelType is "dm" | "group";
export interface IChannelRaw {
    id: string;
    name?: string;
    type: ChannelsTypes;
    desc?: string;
    users: string[];
    roles?: IChannelUserRole[];
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
    users: string[];
    roles: IChannelUserRole;
}
export interface IUpdateChannelReq {
    id: string;
    name?: string;
    desc?: string;
    users?: string[];
    roles?: Array<{
        user: string;
        role: EChannelRoles;
    }>;
}
export interface ICreateGroupReq {
    name: string;
    desc?: string;
    users: string[];
    roles: Array<{
        user: string;
        role: EChannelRoles;
    }>;
}
export declare const createGroupReqSchema: Joi.ObjectSchema<ICreateGroupReq>;
export interface IUpdateGroupReq {
    name?: string;
    desc?: string;
    roles?: Array<{
        user: string;
        role: EChannelRoles;
    }>;
}
export declare const updateGroupReqSchema: Joi.ObjectSchema<IUpdateGroupReq>;
export declare const channelsSwagger: {
    createGroup: {
        type: string;
        properties: {
            name: {
                type: string;
                required: boolean;
            };
            desc: {
                type: string;
            };
            users: {
                type: string;
                items: string;
                required: boolean;
            };
            roles: {
                type: string;
                properties: {
                    user: {
                        type: string;
                        required: boolean;
                    };
                    role: {
                        type: string;
                        enum: string[];
                        required: boolean;
                    };
                };
            };
        };
    };
    upgradeGroup: {
        type: string;
        properties: {
            name: {
                type: string;
            };
            desc: {
                type: string;
            };
            roles: {
                type: string;
                properties: {
                    user: {
                        type: string;
                        required: boolean;
                    };
                    role: {
                        type: string;
                        enum: string[];
                        required: boolean;
                    };
                };
            };
        };
    };
};
