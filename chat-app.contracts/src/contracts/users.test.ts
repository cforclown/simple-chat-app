import { changePasswordReqSchema, IChangePasswordReq, IUpdateUserPayload, updateUserProfileReqSchema } from './users';

describe('users-data-transfer-object', () => {
  const mockUpdateUserPayload: IUpdateUserPayload = {
    username: 'update-username',
    email: 'update-email@email.com',
    fullname: 'update-fullname'
  };

  const mockChangePasswordPayload: IChangePasswordReq = {
    currentPassword: 'mock-password',
    newPassword: '1MockNewPassword!',
    confirmNewPassword: '1MockNewPassword!'
  };

  describe('updateUserPayloadSchema', () => {
    it('should return value when schema is valid', () => {
      const { value } = updateUserProfileReqSchema.validate(mockUpdateUserPayload);
      expect(value).toEqual(mockUpdateUserPayload);
    });

    it('should return value when schema is valid optional fields is not set', () => {
      const { value } = updateUserProfileReqSchema.validate({ fullname: 'fullname' });
      expect(value).toEqual({ fullname: 'fullname' });
    });

    it('should throw validation exception when payload is not valid', () => {
      const { error } = updateUserProfileReqSchema.validate({ invalidField: 'invalid field value' });
      expect(error).toBeTruthy();
    });

    it('should throw validation exception when payload is not object', () => {
      const { error } = updateUserProfileReqSchema.validate(null);
      expect(error).toBeTruthy();
    });
  });

  describe('changePasswordReqSchema', () => {
    it('should return value when schema is valid', () => {
      const { value } = changePasswordReqSchema.validate(mockChangePasswordPayload);
      expect(value).toEqual(mockChangePasswordPayload);
    });

    it('should throw validation exception when payload is not valid', () => {
      const { error } = changePasswordReqSchema.validate({ invalidField: 'invalid field value' });
      expect(error).toBeTruthy();
    });

    it('should throw validation exception when payload is not object', () => {
      const { error } = changePasswordReqSchema.validate(null);
      expect(error).toBeTruthy();
    });
  });
});
