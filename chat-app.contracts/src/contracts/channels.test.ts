import { createGroupReqSchema, EChannelRoles, ICreateGroupReq, IUpdateGroupReq, updateGroupReqSchema } from './channels';

describe('channels.schema', () => {
  const mockCreateGroupPayload: ICreateGroupReq = {
    name: 'channel name',
    desc: 'mock channel desc',
    users: ['mock-user-id'],
    roles: [{
      user: 'mock-user-id',
      role: EChannelRoles.OWNER
    }]
  };
  const mockUpdateGroupPayload: IUpdateGroupReq = {
    name: 'channel name',
    desc: 'mock channel desc',
    roles: [
      { user: 'mock-user1-id', role: EChannelRoles.OWNER }
    ]
  };

  describe('createGroupReqSchema', () => {
    it('should return value when schema is valid', () => {
      const { value } = createGroupReqSchema.validate(mockCreateGroupPayload);
      expect(value).toEqual(mockCreateGroupPayload);
    });

    it('should return value when only required fields provided', () => {
      const { value } = createGroupReqSchema.validate({
        name: 'channel name',
        users: ['mock-user-id'],
        roles: [{
          user: 'mock-user-id',
          role: EChannelRoles.OWNER
        }]
      });
      expect(value).toEqual({
        name: 'channel name',
        users: ['mock-user-id'],
        roles: [{
          user: 'mock-user-id',
          role: EChannelRoles.OWNER
        }],
        desc: null
      });
    });

    it('should throw validation exception when required field not provided', () => {
      const { error } = createGroupReqSchema.validate({
        ...mockCreateGroupPayload,
        name: undefined
      });
      expect(error).toBeTruthy();
    });
  });

  describe('updateGroupReqSchema', () => {
    it('should return value when schema is valid', () => {
      const { value } = updateGroupReqSchema.validate(mockUpdateGroupPayload);
      expect(value).toEqual(mockUpdateGroupPayload);
    });

    it('should return value when payload only contain some fields', () => {
      const { value } = updateGroupReqSchema.validate({ name: 'new name' });
      expect(value).toEqual({ name: 'new name' });
    });

    it('should throw validation exception when payload is not object', () => {
      const { error } = updateGroupReqSchema.validate(null);
      expect(error).toBeTruthy();
    });
  });
});
