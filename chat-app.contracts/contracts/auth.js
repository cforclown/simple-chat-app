"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSwagger = exports.refreshTokenReqSchema = exports.registerReqSchema = exports.loginReqSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.loginReqSchema = joi_1.default.object({
    username: joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.string().email()).required(),
    password: joi_1.default.string().required()
});
/**
 * NOTE!
 *
 * usersname RULEs ->
 * - Only contains alphanumeric characters, underscore and dot.
 * - Underscore and dot can't be at the end or start of a username (e.g _username / username_ / .username / username.).
 * - Underscore and dot can't be next to each other (e.g user_.name).
 * - Underscore or dot can't be used multiple times in a row (e.g user__name / user..name).
 * - Number of characters must be between 6 to 24.
 *
 * password RULEs ->
 * - Password must contain one digit from 0 to 9
 * - one lowercase letter,
 * - one uppercase letter,
 * - no space
 * - it must be 8-24 characters long.
 * - Usage of special character is optional.
 */
exports.registerReqSchema = joi_1.default.object({
    username: joi_1.default.string().regex(/^(?=[a-zA-Z0-9._]{6,24}$)(?!.*[_.]{2})[^_.].*[^_.]$/).required(),
    email: joi_1.default.string().email().required(),
    fullname: joi_1.default.string().required(),
    password: joi_1.default.string().regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).{8,24}$/).required(),
    confirmPassword: joi_1.default.any()
        .valid(joi_1.default.ref('password'))
        .required()
        .options({
        messages: { 'any.only': '{{#label}} does not match' }
    })
});
exports.refreshTokenReqSchema = joi_1.default.object({
    refreshToken: joi_1.default.string().required()
});
exports.authSwagger = {
    login: {
        type: 'object',
        properties: {
            username: { type: 'string', required: true },
            password: { type: 'string', required: true }
        }
    },
    register: {
        type: 'object',
        properties: {
            username: { type: 'string', required: true },
            email: { type: 'string', required: true },
            fullname: { type: 'string', required: true },
            password: { type: 'string', required: true },
            confirmPassword: { type: 'string', required: true }
        }
    },
    refreshToken: {
        type: 'object',
        properties: {
            refreshToken: { type: 'string', required: true }
        }
    }
};
