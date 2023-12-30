import { model, Types } from 'mongoose';
import { BaseDataAccessObject } from 'cexpress-utils/lib';
import { IChannel, IChannelRaw, IMessage, IUser } from 'chat-app.contracts';
import { UsersDao } from '..';
import { NullOr } from '../../utils';

export class ChannelsDao extends BaseDataAccessObject<IChannelRaw> {
  public static readonly INSTANCE_NAME = 'channelsDao';
  public static readonly MODEL_NAME = 'channels';

  constructor () {
    super(model<IChannelRaw>(ChannelsDao.MODEL_NAME));
  }

  async getChannel (id: string): Promise<NullOr<IChannel>> {
    return this.model
      .findOne({ _id: id, archived: false })
      .select('-messages')
      .exec();
  }

  async getChannelDmByUsers (user1: string, user2: string): Promise<NullOr<IChannel<IUser>>> {
    const channel = await this.model
      .findOne({
        users: {
          $in: [
            new Types.ObjectId(user1),
            new Types.ObjectId(user2)
          ]
        }
      })
      .populate({
        path: 'users',
        select: UsersDao.UNSELECT_FORBIDDEN_FIELDS
      })
      .select('-messages')
      .exec();

    return channel?.toObject();
  }

  async createChannel (payload: Record<string, any>): Promise<IChannel<IUser>> {
    const channel = await this.model.findOneAndUpdate({ _id: new Types.ObjectId() }, payload, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      populate: {
        path: 'users',
        select: UsersDao.UNSELECT_FORBIDDEN_FIELDS
      }
    });

    return channel.toObject();
  }

  async getUserChannels (user: string): Promise<IChannel<IUser>[]> {
    return this.model
      .aggregate([
        {
          $match: {
            users: new Types.ObjectId(user),
            archived: false
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'users',
            foreignField: '_id',
            as: 'users',
            pipeline: [{
              $project: {
                password: 0,
                avatar: 0,
                archived: 0,
                createdAt: 0,
                updatedAt: 0
              }
            }]
          }
        },
        {
          $addFields: {
            id: '$_id',
            users: {
              $map: {
                input: '$users',
                as: 'user',
                in: {
                  $mergeObjects: [
                    '$$user',
                    {
                      id: '$$user._id'
                    }
                  ]
                }
              }
            },
            unreadMessages: {
              $size: {
                $filter: {
                  input: { $ifNull: ['$messages', []] }, // default empty array if array is does not exist
                  cond: {
                    $and: [
                      { $ne: ['$$this.read', true] },
                      { $ne: ['$$this.sender', new Types.ObjectId(user)] }
                    ]
                  }
                }
              }
            },
            lastMessage: {
              $last: '$messages.text'
            }
          }
        },
        { $sort: { updatedAt: -1 } },
        { $project: { messages: 0 } }
      ])
      .exec();
  }

  async pushMsg (channelId: string, msg: IMessage): Promise<[IChannel<IUser>, IMessage] | null> {
    const channel = await this.model
      .findOneAndUpdate(
        { _id: channelId },
        {
          $push: {
            messages: {
              ...msg,
              _id: new Types.ObjectId(msg.id),
              sender: new Types.ObjectId(msg.sender)
            }
          }
        },
        { new: true }
      )
      .populate({
        path: 'users',
        select: UsersDao.UNSELECT_FORBIDDEN_FIELDS
      })
      .exec();

    if (!channel) {
      return null;
    }

    return [channel.toObject(), msg];
  }

  async editMsg (channelId: string, msgId: string, text: string): Promise<IMessage | null> {
    const channel = await this.model
      .findOneAndUpdate(
        {
          _id: channelId,
          'messages._id': new Types.ObjectId(msgId)
        },
        {
          $set: {
            'messages.$.text': text
          }
        },
        {
          new: true
        }
      ).exec();
    if (!channel) {
      return null;
    }

    const msgDoc: IMessage | undefined = channel.messages.find(m => m.id === msgId);
    if (!msgDoc) {
      return null;
    }

    return msgDoc;
  }

  async readMsgs (channelId: string, user: string): Promise<void> {
    await this.model.updateOne({ _id: channelId }, [{
      $set: {
        messages: {
          $map: {
            input: '$messages',
            as: 'message',
            in: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$$message.read', true] },
                    { $ne: ['$$message.sender', new Types.ObjectId(user)] }
                  ]
                },
                {
                  $mergeObjects: ['$$message', { read: true }]
                },
                '$$message'
              ]
            }
          }
        }
      }
    }]);
  }

  async getMsgs (channelId: string): Promise<IMessage[] | null> {
    const channel = await this.model
      .findOne({ _id: channelId, archived: false })
      .sort({ createdAt: 'descending' })
      .exec();
    if (!channel) {
      return null;
    }

    return channel.messages;
  }
}
