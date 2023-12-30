import { Request } from 'express';
import { HttpStatusCode } from 'axios';
import { BaseController, RestApiException } from 'cexpress-utils/lib';
import { IChannel, IChannelRaw, IUser } from 'chat-app.contracts';
import { ChannelsService } from '.';

export class ChannelsController extends BaseController<IChannelRaw> {
  public static readonly INSTANCE_NAME = 'channelsController';

  private readonly channelsService: ChannelsService;

  constructor (channelsService: ChannelsService) {
    super(channelsService);
    this.channelsService = channelsService;

    this.getUserChannels = this.getUserChannels.bind(this);
    this.createGroup = this.createGroup.bind(this);
    this.updateGroup = this.updateGroup.bind(this);
  }

  async getUserChannels ({ user }: Request): Promise<IChannel<IUser>[]> {
    return this.channelsService.getUserChannels((user as IUser).id);
  }

  async createGroup ({ user, body }: Request): Promise<IChannel<IUser>> {
    return this.channelsService.createGroup((user as IUser).id, body);
  }

  async updateGroup ({ params, body }: Request): Promise<IChannel> {
    const channel = await this.channelsService.updateGroup(params.id, body);
    if (!channel) {
      throw new RestApiException('Failed to update channel', HttpStatusCode.NotFound);
    }

    return channel;
  }
}
