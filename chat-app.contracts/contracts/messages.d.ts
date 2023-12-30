import Joi from 'joi';
export interface IMessage {
    id: string;
    channel: string;
    sender: string;
    text: string;
    read?: boolean;
    createdAt: Date;
    updatedAt?: Date;
    archived?: boolean;
}
export interface IStartConversationReq {
    receiver: string;
    text: string;
}
export declare const startConversationReqSchema: Joi.ObjectSchema<IStartConversationReq>;
export interface ISendMsgReq {
    text: string;
}
export declare const sendMsgReqSchema: Joi.ObjectSchema<ISendMsgReq>;
export type IEditMsgReq = ISendMsgReq;
export declare const editMsgPayloadSchema: Joi.ObjectSchema<ISendMsgReq>;
export declare const messagesSwagger: {
    startConversation: {
        type: string;
        properties: {
            receiver: {
                type: string;
                required: boolean;
            };
            text: {
                type: string;
                required: boolean;
            };
        };
    };
    sendMsg: {
        type: string;
        properties: {
            text: {
                type: string;
                required: boolean;
            };
        };
    };
    editMsg: {
        type: string;
        properties: {
            text: {
                type: string;
            };
        };
    };
};
