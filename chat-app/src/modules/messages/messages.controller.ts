import { Request } from 'express';
import { Server } from 'socket.io';
import { HttpStatusCode } from 'axios';
import { IAMQP } from 'amqp';
import { dro, Logger, RestApiException } from 'cexpress-utils/lib';
import { IChannel, IMessage, ISendMsgReq, IStartConversationReq, IUser } from 'chat-app.contracts';
import { MessagesService } from '.';
import { IO_INSTANCE_NAME } from '../../socketio';
import SIOController from '../../socketio/sio.controller';
import { NullOr } from '../../utils';

export class MessagesController {
  public static readonly INSTANCE_NAME = 'messagesController';

  constructor (
    private readonly messagesService: MessagesService,
    private readonly sioController: SIOController,
    private readonly amqp: IAMQP
  ) {
    this.getMsgs = this.getMsgs.bind(this);
    this.startConversation = this.startConversation.bind(this);
    this.sendMsg = this.sendMsg.bind(this);
    this.readMsgs = this.readMsgs.bind(this);
  }

  async getMsgs ({ params }: Request): Promise<IMessage[]> {
    const msgs = await this.messagesService.getMsgs(params.id);
    if (!msgs) {
      throw new RestApiException('Invalid channel id', HttpStatusCode.NotFound);
    }

    return msgs;
  }

  async startConversation ({ app, user: u, body }: Request): Promise<NullOr<IChannel<IUser>>> {
    const user = u as IUser;
    const payload: IStartConversationReq = body;

    const result = await this.messagesService.startConversation(user.id, payload);
    if (!result) {
      throw new RestApiException('Invalid channel id');
    }

    const [channel, msg] = result;

    const io: Server | undefined | null = app.get(IO_INSTANCE_NAME);
    io?.to(payload.receiver).emit('on-message', dro.response(msg));
    if (!this.sioController.users[payload.receiver]) { // we only send message to amqp when user is offline
      // dont need to wait for the process
      this.amqp.pushMsg(payload.receiver, msg).catch(err => Logger.exception(err));
    }

    return channel;
  }

  async sendMsg ({ app, user: u, params, body }: Request): Promise<IMessage | null> {
    const user = u as IUser;
    const payload: ISendMsgReq = body;

    const result = await this.messagesService.sendMsg(params.id, user.id, payload);
    if (!result) {
      throw new RestApiException('Failed to send message');
    }

    const [channel, msg] = result;
    const receivers = channel.users.filter(u => u.toString() !== user.id);
    if (receivers.length) {
      const io: Server | undefined | null = app.get(IO_INSTANCE_NAME);
      receivers.forEach(receiver => {
        io?.to(receiver.id).emit('on-message', dro.response(msg));
        if (!this.sioController.users[receiver.id]) { // we only send message to amqp when user is offline
          // dont need to wait for the process
          this.amqp.pushMsg(receiver.id, msg).catch(err => Logger.exception(err));
        }
      });
    }

    return msg;
  }

  async readMsgs ({ user, params }: Request): Promise<boolean> {
    await this.messagesService.readMsgs(params.id, (user as IUser).id);

    return true;
  }
}
