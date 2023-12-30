import { Schema, Types } from 'mongoose';
import { channelTypes, EChannelRoles, IChannelRaw } from 'chat-app.contracts';
import { messagesSchema, USERS_COLLECTION_NAME } from '..';

export interface IChannelDoc extends Omit<IChannelRaw, '_id' | 'users'> {
  _id: Types.ObjectId;
  users: Types.ObjectId[];
}

export const CHANNELS_COLLECTION_NAME = 'channels';

export const channelsSchema = new Schema<IChannelDoc>({
  name: { type: String },
  type: {
    type: String,
    enum: [...channelTypes],
    required: false,
    default: 'dm'
  },
  desc: { type: String, default: null },
  users: {
    type: [{
      type: Types.ObjectId,
      ref: USERS_COLLECTION_NAME
    }],
    required: true
  },
  roles: {
    type: [{
      user: {
        type: Types.ObjectId,
        ref: USERS_COLLECTION_NAME,
        required: true
      },
      role: {
        type: String,
        enum: EChannelRoles,
        default: EChannelRoles.MEMBER
      }
    }],
    default: null
  },
  messages: { type: [messagesSchema], default: [] },
  archived: { type: Boolean, default: false }
}, { timestamps: true });

// virtualize _id to id when doing query
channelsSchema.virtual('id').get(function () {
  return this._id.toString();
});

// Ensure virtual fields are serialised.
channelsSchema.set('toJSON', { virtuals: true });

// Ensure virtual fields are serialised.
channelsSchema.set('toObject', { virtuals: true });
