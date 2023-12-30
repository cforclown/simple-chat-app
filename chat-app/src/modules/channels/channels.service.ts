import { some } from 'lodash';
import { BaseService, RestApiException } from 'cexpress-utils/lib';
import { IChannel, IChannelRaw, ICreateDmChannelReq, ICreateGroupReq, IMessage, IUpdateChannelReq, IUpdateGroupReq, IUser } from 'chat-app.contracts';
import { UsersService } from '..';
import { ChannelsDao } from '.';
import { NullOr } from '../../utils';

export class ChannelsService extends BaseService<IChannelRaw> {
  public static readonly INSTANCE_NAME = 'channelsService';

  constructor (private readonly channelsDao: ChannelsDao, private readonly usersService: UsersService) {
    super(channelsDao);

    this.channelsDao = channelsDao;
    this.usersService = usersService;
  }

  async getChannelDmByUsers (user1: string, user2: string): Promise<NullOr<IChannel<IUser>>> {
    return this.channelsDao.getChannelDmByUsers(user1, user2);
  }

  async getUserChannels (user: string): Promise<IChannel<IUser>[]> {
    return this.channelsDao.getUserChannels(user);
  }

  async createDm (users: [string, string]): Promise<IChannel<IUser>> {
    const checkUsers = await Promise.all(users.map(user => this.usersService.get(user)));
    if (some(checkUsers, user => !user)) {
      throw new RestApiException('Some user id is invalid');
    }

    const dmChannel: ICreateDmChannelReq = {
      type: 'dm',
      users
    };

    return this.channelsDao.createChannel(dmChannel);
  }

  async createGroup (user: string, payload: ICreateGroupReq): Promise<IChannel<IUser>> {
    const usersDocs = await Promise.all(payload.users.map(user => this.usersService.get(user)));
    if (some(usersDocs, user => !user)) {
      throw new RestApiException('Some user id is invalid');
    }

    const users = [user, ...payload.users.filter(u => u !== user)];
    const groupChannel: ICreateGroupReq & { type: 'group', } = {
      ...payload,
      type: 'group',
      users
    };

    return this.channelsDao.createChannel(groupChannel);
  }

  async updateGroup (channel: string, payload: IUpdateGroupReq): Promise<IChannel | null> {
    if (payload.roles) {
      const [channelDoc, ...usersDocs] = await Promise.all([
        this.channelsDao.getChannel(channel),
        ...payload.roles.map(role => this.usersService.get(role.user))
      ]);
      if (!channelDoc) {
        throw new RestApiException('Channel not found');
      }
      if (some(usersDocs, user => !user) || some(payload.roles, role => !usersDocs.find(u => u?.id === role.user))) {
        throw new RestApiException('Some roles assign to invalid user id');
      }
    }

    const groupChannel: IUpdateChannelReq = {
      id: channel,
      ...payload
    };

    return this.update(groupChannel);
  }

  async pushMsg (channel: string, msg: IMessage): Promise<[IChannel<IUser>, IMessage] | null> {
    return this.channelsDao.pushMsg(channel, msg);
  }

  async editMsg (channel: string, msgId: string, text: string): Promise<IMessage | null> {
    return this.channelsDao.editMsg(channel, msgId, text);
  }

  async readMsgs (channel: string, user: string): Promise<void> {
    return this.channelsDao.readMsgs(channel, user);
  }

  async getMsgs (channel: string): Promise<IMessage[] | null> {
    return this.channelsDao.getMsgs(channel);
  }
}
