import { editMsgPayloadSchema, sendMsgReqSchema, startConversationReqSchema } from '.';

describe('channels.schema', () => {
  describe('startConversationReqSchema', () => {
    it('should return value when schema is valid', () => {
      const { value } = startConversationReqSchema.validate({
        receiver: 'mock-user-id',
        text: 'yo wassap!'
      });
      expect(value).toEqual({
        receiver: 'mock-user-id',
        text: 'yo wassap!'
      });
    });

    it('should throw validation exception when required field not provided', () => {
      const { error } = startConversationReqSchema.validate({ text: 'text' });
      expect(error).toBeTruthy();
    });
  });

  describe('sendMsgReqSchema', () => {
    it('should return value when schema is valid', () => {
      const { value } = sendMsgReqSchema.validate({ text: 'yo wassap!' });
      expect(value).toEqual({ text: 'yo wassap!' });
    });

    it('should throw validation exception when required field not provided', () => {
      const { error } = sendMsgReqSchema.validate({});
      expect(error).toBeTruthy();
    });
  });

  describe('editMsgPayloadSchema', () => {
    it('should return value when schema is valid', () => {
      const { value } = editMsgPayloadSchema.validate({ text: 'mock new text' });
      expect(value).toEqual({ text: 'mock new text' });
    });

    it('should throw validation exception when payload is not object', () => {
      const { error } = editMsgPayloadSchema.validate(null);
      expect(error).toBeTruthy();
    });
  });
});
