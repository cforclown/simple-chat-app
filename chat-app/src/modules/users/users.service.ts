import { hashPassword, RestApiException } from 'cexpress-utils/lib';
import {
  IChangePasswordReq,
  ICreateUserPayload,
  ILoginReq,
  IUpdateUserPayload,
  IUser
} from 'chat-app.contracts';
import { NullOr } from '../../utils';
import { UsersDao } from '.';

export class UsersService {
  private readonly usersDao: UsersDao;

  constructor (usersDao: UsersDao) {
    this.usersDao = usersDao;
  }

  async authenticate ({ username, password }: ILoginReq): Promise<NullOr<IUser>> {
    return this.usersDao.authenticate({
      username,
      password: (await hashPassword(password))
    });
  }

  get (userId: string): Promise<NullOr<IUser>> {
    return this.usersDao.get(userId);
  }

  getAll (query: string): Promise<IUser[]> {
    return this.usersDao.getAll(query);
  }

  async create (payload: ICreateUserPayload): Promise<IUser> {
    const [isUsernameTaken, isEmailRegistered] = await Promise.all([
      this.usersDao.getByUsername(payload.username),
      this.usersDao.getByEmail(payload.email)
    ]);
    if (isUsernameTaken) {
      throw new RestApiException('Username is taken');
    }
    if (isEmailRegistered) {
      throw new RestApiException('Email already registered');
    }

    return this.usersDao.create(payload);
  }

  async updateProfile (userId: string, payload: IUpdateUserPayload): Promise<NullOr<IUser>> {
    const [user, isUsernameTaken, isEmailRegistered] = await Promise.all([
      this.usersDao.get(userId),
      payload.username ? this.usersDao.getByUsername(payload.username) : false,
      payload.email ? this.usersDao.getByEmail(payload.email) : false
    ]);
    if (!user) {
      throw new RestApiException('User not found');
    }
    if (isUsernameTaken && user.username !== payload.username) {
      throw new RestApiException('Username is taken');
    }
    if (isEmailRegistered && user.email !== payload.email) {
      throw new RestApiException('Email already registered');
    }

    return this.usersDao.update({ id: userId, ...payload });
  }

  async changePassword (userId: string, payload: IChangePasswordReq): Promise<NullOr<IUser>> {
    const user = await this.usersDao.get(userId);
    if (!user) {
      throw new RestApiException('User not found');
    }
    if (!(await this.usersDao.authenticate({
      username: user.username,
      password: (await hashPassword(payload.currentPassword))
    }))) {
      throw new RestApiException('Invalid password');
    }

    return this.usersDao.update({
      id: user.id,
      password: (await hashPassword(payload.newPassword))
    });
  }

  delete (userId: string): Promise<string | null> {
    return this.usersDao.delete(userId);
  }
}
