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

export interface IUser extends Omit<IUserRaw, 'password' | 'archived' | 'createdAt' | 'updatedAt'> {}

export interface ICreateUserPayload {
  username: string;
  email: string;
  password?: string;
  fullname: string;
};

export interface IUpdateUserProfileReq {
  username?: string;
  email?: string;
  fullname?: string;
}

export const updateUserProfileReqSchema = Joi.object<IUpdateUserProfileReq>({
  username: Joi.string(),
  fullname: Joi.string(),
  email: Joi.string().email()
});

export interface IUpdateUserPayload extends IUpdateUserProfileReq {
  password?: string;
}

export interface IChangePasswordReq {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const changePasswordReqSchema = Joi.object<IChangePasswordReq>({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).{8,24}$/).required(),
  confirmNewPassword: Joi
    .string()
    .equal(Joi.ref('newPassword'))
    .required()
    .label('Confirm password')
    .options({ messages: { 'any.only': '{{#label}} does not match' } })
});

export const usersSwagger = {
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
