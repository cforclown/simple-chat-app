import Joi from 'joi';

export interface IMessage {
  id: string;
  channel: string; // channel id
  sender: string; // sender user id
  text: string;
  read?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  archived?: boolean;
}

export interface IStartConversationReq {
  receiver: string;
  text: string;
};

export const startConversationReqSchema = Joi.object<IStartConversationReq>({
  receiver: Joi.string().required(),
  text: Joi.string().required()
});

export interface ISendMsgReq {
  text: string;
};

export const sendMsgReqSchema = Joi.object<ISendMsgReq>({
  text: Joi.string().required()
});

export type IEditMsgReq = ISendMsgReq;

export const editMsgPayloadSchema = Joi.object<IEditMsgReq>({
  text: Joi.string().required()
});

export const messagesSwagger = {
  startConversation: {
    type: 'object',
    properties: {
      receiver: { type: 'string', required: true },
      text: { type: 'string', required: true }
    }
  },
  sendMsg: {
    type: 'object',
    properties: {
      text: { type: 'string', required: true }
    }
  },
  editMsg: {
    type: 'object',
    properties: {
      text: { type: 'string' }
    }
  }
};
