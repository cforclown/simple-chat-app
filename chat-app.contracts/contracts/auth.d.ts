import Joi from 'joi';
import { IUser } from './users';
export interface IUserContext {
    user: IUser;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
export interface ILoginReq {
    username: string;
    password: string;
}
export declare const loginReqSchema: Joi.ObjectSchema<ILoginReq>;
export interface IRegisterUserReq {
    username: string;
    email: string;
    fullname: string;
    password: string;
    confirmPassword: string;
}
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
export declare const registerReqSchema: Joi.ObjectSchema<IRegisterUserReq>;
export interface IRefreshTokenReq {
    refreshToken: string;
}
export declare const refreshTokenReqSchema: Joi.ObjectSchema<IRefreshTokenReq>;
export declare const authSwagger: {
    login: {
        type: string;
        properties: {
            username: {
                type: string;
                required: boolean;
            };
            password: {
                type: string;
                required: boolean;
            };
        };
    };
    register: {
        type: string;
        properties: {
            username: {
                type: string;
                required: boolean;
            };
            email: {
                type: string;
                required: boolean;
            };
            fullname: {
                type: string;
                required: boolean;
            };
            password: {
                type: string;
                required: boolean;
            };
            confirmPassword: {
                type: string;
                required: boolean;
            };
        };
    };
    refreshToken: {
        type: string;
        properties: {
            refreshToken: {
                type: string;
                required: boolean;
            };
        };
    };
};
