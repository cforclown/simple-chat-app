"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channels_1 = require("./channels");
describe('channels.schema', () => {
    const mockCreateGroupPayload = {
        name: 'channel name',
        desc: 'mock channel desc',
        users: ['mock-user-id'],
        roles: [{
                user: 'mock-user-id',
                role: channels_1.EChannelRoles.OWNER
            }]
    };
    const mockUpdateGroupPayload = {
        name: 'channel name',
        desc: 'mock channel desc',
        roles: [
            { user: 'mock-user1-id', role: channels_1.EChannelRoles.OWNER }
        ]
    };
    describe('createGroupReqSchema', () => {
        it('should return value when schema is valid', () => {
            const { value } = channels_1.createGroupReqSchema.validate(mockCreateGroupPayload);
            expect(value).toEqual(mockCreateGroupPayload);
        });
        it('should return value when only required fields provided', () => {
            const { value } = channels_1.createGroupReqSchema.validate({
                name: 'channel name',
                users: ['mock-user-id'],
                roles: [{
                        user: 'mock-user-id',
                        role: channels_1.EChannelRoles.OWNER
                    }]
            });
            expect(value).toEqual({
                name: 'channel name',
                users: ['mock-user-id'],
                roles: [{
                        user: 'mock-user-id',
                        role: channels_1.EChannelRoles.OWNER
                    }],
                desc: null
            });
        });
        it('should throw validation exception when required field not provided', () => {
            const { error } = channels_1.createGroupReqSchema.validate({
                ...mockCreateGroupPayload,
                name: undefined
            });
            expect(error).toBeTruthy();
        });
    });
    describe('updateGroupReqSchema', () => {
        it('should return value when schema is valid', () => {
            const { value } = channels_1.updateGroupReqSchema.validate(mockUpdateGroupPayload);
            expect(value).toEqual(mockUpdateGroupPayload);
        });
        it('should return value when payload only contain some fields', () => {
            const { value } = channels_1.updateGroupReqSchema.validate({ name: 'new name' });
            expect(value).toEqual({ name: 'new name' });
        });
        it('should throw validation exception when payload is not object', () => {
            const { error } = channels_1.updateGroupReqSchema.validate(null);
            expect(error).toBeTruthy();
        });
    });
});
