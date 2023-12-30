"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesSwagger = exports.editMsgPayloadSchema = exports.sendMsgReqSchema = exports.startConversationReqSchema = void 0;
const joi_1 = __importDefault(require("joi"));
;
exports.startConversationReqSchema = joi_1.default.object({
    receiver: joi_1.default.string().required(),
    text: joi_1.default.string().required()
});
;
exports.sendMsgReqSchema = joi_1.default.object({
    text: joi_1.default.string().required()
});
exports.editMsgPayloadSchema = joi_1.default.object({
    text: joi_1.default.string().required()
});
exports.messagesSwagger = {
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
