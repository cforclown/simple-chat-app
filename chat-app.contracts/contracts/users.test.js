"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("./users");
describe('users-data-transfer-object', () => {
    const mockUpdateUserPayload = {
        username: 'update-username',
        email: 'update-email@email.com',
        fullname: 'update-fullname'
    };
    const mockChangePasswordPayload = {
        currentPassword: 'mock-password',
        newPassword: '1MockNewPassword!',
        confirmNewPassword: '1MockNewPassword!'
    };
    describe('updateUserPayloadSchema', () => {
        it('should return value when schema is valid', () => {
            const { value } = users_1.updateUserProfileReqSchema.validate(mockUpdateUserPayload);
            expect(value).toEqual(mockUpdateUserPayload);
        });
        it('should return value when schema is valid optional fields is not set', () => {
            const { value } = users_1.updateUserProfileReqSchema.validate({ fullname: 'fullname' });
            expect(value).toEqual({ fullname: 'fullname' });
        });
        it('should throw validation exception when payload is not valid', () => {
            const { error } = users_1.updateUserProfileReqSchema.validate({ invalidField: 'invalid field value' });
            expect(error).toBeTruthy();
        });
        it('should throw validation exception when payload is not object', () => {
            const { error } = users_1.updateUserProfileReqSchema.validate(null);
            expect(error).toBeTruthy();
        });
    });
    describe('changePasswordReqSchema', () => {
        it('should return value when schema is valid', () => {
            const { value } = users_1.changePasswordReqSchema.validate(mockChangePasswordPayload);
            expect(value).toEqual(mockChangePasswordPayload);
        });
        it('should throw validation exception when payload is not valid', () => {
            const { error } = users_1.changePasswordReqSchema.validate({ invalidField: 'invalid field value' });
            expect(error).toBeTruthy();
        });
        it('should throw validation exception when payload is not object', () => {
            const { error } = users_1.changePasswordReqSchema.validate(null);
            expect(error).toBeTruthy();
        });
    });
});
