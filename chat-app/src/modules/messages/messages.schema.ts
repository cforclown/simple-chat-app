import { Schema, Types } from 'mongoose';
import { IMessage } from 'chat-app.contracts';
import { USERS_COLLECTION_NAME } from '..';

export interface IMessageDoc extends Omit<IMessage, '_id' | 'channel' | 'sender'> {
  _id: Types.ObjectId;
  channel: Types.ObjectId;
  sender: Types.ObjectId;
}

export const messagesSchema = new Schema<IMessageDoc>({
  channel: {
    type: Schema.Types.ObjectId,
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: USERS_COLLECTION_NAME,
    required: true
  },
  text: { type: String, required: true },
  read: { type: Boolean, default: false },
  archived: { type: Boolean, default: false }
}, { timestamps: true });

// virtualize _id to id when doing query
messagesSchema.virtual('id').get(function () {
  return this._id.toString();
});

// Ensure virtual fields are serialised.
messagesSchema.set('toJSON', {
  virtuals: true
});
