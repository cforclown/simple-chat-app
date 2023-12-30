import { Request } from 'express';
import { HttpStatusCode } from 'axios';
import { RestApiException } from 'cexpress-utils/lib';
import { IUser } from 'chat-app.contracts';
import { UsersService } from '.';

export class UsersController {
  public static readonly INSTANCE_NAME = 'usersController';

  private readonly usersService: UsersService;

  constructor (usersService: UsersService) {
    this.usersService = usersService;

    this.get = this.get.bind(this);
    this.getAll = this.getAll.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.delete = this.delete.bind(this);
  }

  async get ({ params }: Request): Promise<IUser> {
    const user = await this.usersService.get(params.id);
    if (!user) {
      throw new RestApiException('User not found', HttpStatusCode.NotFound);
    }
    return user;
  }

  async getAll ({ query }: Request): Promise<IUser[]> {
    return this.usersService.getAll((query as Record<string, any>).query);
  }

  async updateProfile ({ user, body }: Request): Promise<IUser> {
    const updatedUser = await this.usersService.updateProfile((user as IUser).id, body);
    if (!updatedUser) {
      throw new RestApiException('User not found');
    }

    return updatedUser;
  }

  async changePassword ({ user, body }: Request): Promise<IUser> {
    const result = await this.usersService.changePassword((user as IUser).id, body);
    if (!result) {
      throw new RestApiException('User not found');
    }

    return result;
  }

  async delete ({ user, params }: Request): Promise<string> {
    if ((user as IUser).id !== params.id) {
      throw new RestApiException('Action not allowed', HttpStatusCode.NotAcceptable);
    }

    const result = await this.usersService.delete(params.id);
    if (!result) {
      throw new RestApiException('User not found');
    }

    return result;
  }
}
