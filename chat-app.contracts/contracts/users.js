"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersSwagger = exports.changePasswordReqSchema = exports.updateUserProfileReqSchema = void 0;
const joi_1 = __importDefault(require("joi"));
;
exports.updateUserProfileReqSchema = joi_1.default.object({
    username: joi_1.default.string(),
    fullname: joi_1.default.string(),
    email: joi_1.default.string().email()
});
exports.changePasswordReqSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().required(),
    newPassword: joi_1.default.string().regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).{8,24}$/).required(),
    confirmNewPassword: joi_1.default
        .string()
        .equal(joi_1.default.ref('newPassword'))
        .required()
        .label('Confirm password')
        .options({ messages: { 'any.only': '{{#label}} does not match' } })
});
exports.usersSwagger = {
    updateUserProfile: {
        type: 'object',
        properties: {
            username: {
                type: 'string',
                default: null
            },
            email: {
                type: 'string',
                default: null
            },
            fullname: {
                type: 'string',
                default: null
            }
        }
    },
    changePassword: {
        type: 'object',
        properties: {
            currentPassword: { type: 'string', required: true },
            newPassword: { type: 'string', required: true },
            confirmNewPassword: { type: 'string', required: true }
        }
    }
};
