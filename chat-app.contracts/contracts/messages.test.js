"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
describe('channels.schema', () => {
    describe('startConversationReqSchema', () => {
        it('should return value when schema is valid', () => {
            const { value } = _1.startConversationReqSchema.validate({
                receiver: 'mock-user-id',
                text: 'yo wassap!'
            });
            expect(value).toEqual({
                receiver: 'mock-user-id',
                text: 'yo wassap!'
            });
        });
        it('should throw validation exception when required field not provided', () => {
            const { error } = _1.startConversationReqSchema.validate({ text: 'text' });
            expect(error).toBeTruthy();
        });
    });
    describe('sendMsgReqSchema', () => {
        it('should return value when schema is valid', () => {
            const { value } = _1.sendMsgReqSchema.validate({ text: 'yo wassap!' });
            expect(value).toEqual({ text: 'yo wassap!' });
        });
        it('should throw validation exception when required field not provided', () => {
            const { error } = _1.sendMsgReqSchema.validate({});
            expect(error).toBeTruthy();
        });
    });
    describe('editMsgPayloadSchema', () => {
        it('should return value when schema is valid', () => {
            const { value } = _1.editMsgPayloadSchema.validate({ text: 'mock new text' });
            expect(value).toEqual({ text: 'mock new text' });
        });
        it('should throw validation exception when payload is not object', () => {
            const { error } = _1.editMsgPayloadSchema.validate(null);
            expect(error).toBeTruthy();
        });
    });
});
