import Joi from 'joi';
export interface IUserRaw {
    id: string;
    username: string;
    email: string;
    fullname: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    archived?: boolean;
}
export interface IUser extends Omit<IUserRaw, 'password' | 'archived' | 'createdAt' | 'updatedAt'> {
}
export interface ICreateUserPayload {
    username: string;
    email: string;
    password?: string;
    fullname: string;
}
export interface IUpdateUserProfileReq {
    username?: string;
    email?: string;
    fullname?: string;
}
export declare const updateUserProfileReqSchema: Joi.ObjectSchema<IUpdateUserProfileReq>;
export interface IUpdateUserPayload extends IUpdateUserProfileReq {
    password?: string;
}
export interface IChangePasswordReq {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}
export declare const changePasswordReqSchema: Joi.ObjectSchema<IChangePasswordReq>;
export declare const usersSwagger: {
    updateUserProfile: {
        type: string;
        properties: {
            username: {
                type: string;
                default: null;
            };
            email: {
                type: string;
                default: null;
            };
            fullname: {
                type: string;
                default: null;
            };
        };
    };
    changePassword: {
        type: string;
        properties: {
            currentPassword: {
                type: string;
                required: boolean;
            };
            newPassword: {
                type: string;
                required: boolean;
            };
            confirmNewPassword: {
                type: string;
                required: boolean;
            };
        };
    };
};
