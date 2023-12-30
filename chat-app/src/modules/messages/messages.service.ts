import { Types } from 'mongoose';
import { ChannelsService } from '..';
import { IChannel, IEditMsgReq, IMessage, ISendMsgReq, IStartConversationReq, IUser } from 'chat-app.contracts';

export class MessagesService {
  public static readonly INSTANCE_NAME = 'messagesService';

  private readonly channelsService: ChannelsService;

  constructor (channelsService: ChannelsService) {
    this.channelsService = channelsService;
  }

  async getMsgs (channel: string): Promise<IMessage[] | null> {
    return this.channelsService.getMsgs(channel);
  }

  // user send message to another for the first time (no channel yet)
  async startConversation (sender: string, payload: IStartConversationReq): Promise<[IChannel<IUser>, IMessage] | null> {
    let channel = await this.channelsService.getChannelDmByUsers(sender, payload.receiver);
    if (!channel) {
      channel = await this.channelsService.createDm([sender, payload.receiver]);
    }
    const result = await this.channelsService.pushMsg(
      channel.id,
      this.createMsgObj(channel.id, sender, payload.text)
    );
    if (!result) {
      return null;
    }

    return result;
  }

  async sendMsg (channel: string, sender: string, payload: ISendMsgReq): Promise<[IChannel<IUser>, IMessage] | null> {
    const result = await this.channelsService.pushMsg(channel, this.createMsgObj(channel, sender, payload.text));
    if (!result) {
      return null;
    }

    return result;
  }

  async editMsg (channel: string, msgId: string, payload: IEditMsgReq): Promise<IMessage | null> {
    return this.channelsService.editMsg(channel, msgId, payload.text);
  }

  async readMsgs (channel: string, user: string): Promise<void> {
    return this.channelsService.readMsgs(channel, user);
  }

  createMsgObj (channel: string, sender: string, text: string): IMessage {
    const id = new Types.ObjectId();
    const createdAt = new Date();
    return {
      id: id.toString(),
      channel,
      sender,
      text,
      createdAt,
      updatedAt: createdAt
    };
  }
}
