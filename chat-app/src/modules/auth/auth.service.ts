import { sign, verify } from 'jsonwebtoken';
import { HttpStatusCode } from 'axios';
import { RestApiException } from 'cexpress-utils/lib';
import { ILoginReq, IRegisterUserReq, IUser, IUserContext } from 'chat-app.contracts';
import { Environment, NullOr } from '../../utils';
import { UsersService } from '..';

export class AuthService {
  public static readonly INSTANCE_NAME = 'authService'

  private readonly usersService: UsersService;

  constructor (usersService: UsersService) {
    this.usersService = usersService;
  }

  async getUserById (userId: string): Promise<IUser> {
    const user = await this.usersService.get(userId);
    if (!user) {
      throw new RestApiException('User not found');
    }
    return user;
  }

  async authenticate (payload: ILoginReq): Promise<NullOr<IUser>> {
    return this.usersService.authenticate(payload);
  }

  async login (payload: ILoginReq): Promise<IUserContext> {
    const user = await this.usersService.authenticate(payload);
    if (!user) {
      throw new RestApiException('Incorrect username or password', HttpStatusCode.NotFound);
    }

    return this.generateAccessToken(user);
  }

  async verify (user?: IUser): Promise<IUserContext> {
    if (!user) {
      throw new Error('No user object in request');
    }
    return this.generateAccessToken(user);
  }

  async register (payload: IRegisterUserReq): Promise<IUserContext> {
    if (payload.password !== payload.confirmPassword) {
      throw new RestApiException('Confirm password is not match');
    }

    const user = await this.usersService.create(payload);

    return this.generateAccessToken(user);
  }

  async refresh (refreshToken: string): Promise<IUserContext> {
    try {
      const tokenData = verify(refreshToken, Environment.getRefreshTokenSecret());
      const user = await this.usersService.get((tokenData as IUser).id);
      if (!user) {
        throw new RestApiException('Refresh token is not valid', HttpStatusCode.Unauthorized);
      }

      return this.generateAccessToken(user);
    } catch (err) {
      throw new RestApiException('Refresh token is expired', HttpStatusCode.Unauthorized);
    }
  }

  async verifyAccessToken (accessToken: string): Promise<IUser> {
    try {
      const tokenData = verify(accessToken, Environment.getAccessTokenSecret());
      const user = await this.usersService.get((tokenData as IUser).id);
      if (!user) {
        throw new RestApiException('Refresh token is not valid', HttpStatusCode.Unauthorized);
      }

      return user;
    } catch (err) {
      throw new RestApiException('Refresh token is expired', HttpStatusCode.Unauthorized);
    }
  }

  generateAccessToken (user: IUser): IUserContext {
    const expiresIn = Environment.getAccessTokenExpIn();
    const accessToken = sign(user, Environment.getAccessTokenSecret(), { expiresIn });
    const refreshToken = sign(
      user,
      Environment.getRefreshTokenSecret(),
      { expiresIn: Environment.getRefreshTokenExpIn() }
    );

    return {
      user,
      accessToken,
      refreshToken,
      expiresIn
    };
  }
}
