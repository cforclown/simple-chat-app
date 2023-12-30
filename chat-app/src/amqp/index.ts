import amqp, { Channel, Connection } from 'amqplib';
import { IMessage } from 'chat-app.contracts';
import { Environment } from '../utils';

export interface IAMQP {
  init: () => Promise<void>;
  createQueue: (channel: string) => Promise<void>;
  pushMsg: (receiver: string, msg: IMessage) => Promise<void>;
}

export class AMQP implements IAMQP {
  private conn: Connection | undefined;
  private channel: Channel | undefined;

  async init (): Promise<void> {
    this.conn = await amqp.connect(Environment.getAmqpUrl());
    this.channel = await this.conn.createChannel();
  }

  async createQueue (userId: string): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel not set!');
    }

    this.channel.assertQueue(userId);
  }

  async pushMsg (receiver: string, msg: IMessage): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel not set!');
    }

    this.channel.assertQueue(receiver);
    this.channel.sendToQueue(receiver, Buffer.from(JSON.stringify(msg)));
  }
}
