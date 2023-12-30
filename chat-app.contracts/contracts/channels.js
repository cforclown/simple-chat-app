"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelsSwagger = exports.updateGroupReqSchema = exports.createGroupReqSchema = exports.isValidChannelType = exports.channelTypes = exports.EChannelRoles = void 0;
const joi_1 = __importDefault(require("joi"));
var EChannelRoles;
(function (EChannelRoles) {
    EChannelRoles["OWNER"] = "owner";
    EChannelRoles["ADMIN"] = "admin";
    EChannelRoles["MEMBER"] = "member";
})(EChannelRoles || (exports.EChannelRoles = EChannelRoles = {}));
exports.channelTypes = ['dm', 'group'];
const isValidChannelType = (channelType) => exports.channelTypes.includes(channelType);
exports.isValidChannelType = isValidChannelType;
exports.createGroupReqSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    desc: joi_1.default.string().allow('').default(null),
    users: joi_1.default.array().items(joi_1.default.string()).required(),
    roles: joi_1.default.array().items(joi_1.default.object({
        user: joi_1.default.string().required(),
        role: joi_1.default.string().allow(EChannelRoles).required()
    })).required()
});
exports.updateGroupReqSchema = joi_1.default.object({
    name: joi_1.default.string(),
    desc: joi_1.default.string(),
    roles: joi_1.default.array().items(joi_1.default.object({
        user: joi_1.default.string().required(),
        role: joi_1.default.string().allow(EChannelRoles).required()
    }))
});
exports.channelsSwagger = {
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
