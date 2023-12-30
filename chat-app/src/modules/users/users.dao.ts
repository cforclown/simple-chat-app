import { model, Model } from 'mongoose';
import { ICreateUserPayload, ILoginReq, IUpdateUserPayload, IUser } from 'chat-app.contracts';
import { NullOr } from '../../utils';

export class UsersDao {
  public static readonly INSTANCE_NAME = 'usersDao';
  public static readonly MODEL_NAME = 'users'

  public static readonly UNSELECT_FORBIDDEN_FIELDS = '-password -avatar -archived -createdAt -updatedAt'

  private readonly model: Model<IUser>;

  constructor () {
    this.model = model<IUser>('users');
  }

  async authenticate ({ username, password }: ILoginReq): Promise<NullOr<IUser>> {
    const user = await this.model
      .findOne({
        $or: [
          { username },
          { email: username }
        ],
        password,
        archived: false
      })
      .select('-password -avatar -archived -createdAt -updatedAt')
      .exec();

    return user?.toObject();
  }

  async get (userId: string): Promise<NullOr<IUser>> {
    const user = await this.model
      .findOne({ _id: userId, archived: false })
      .select('-password -avatar -archived -createdAt -updatedAt')
      .exec();

    return user?.toObject();
  }

  async getByUsername (username: string): Promise<NullOr<IUser>> {
    return this.model
      .findOne({ username, archived: false })
      .select('-password -avatar -archived -createdAt -updatedAt')
      .exec();
  }

  async getByEmail (email: string): Promise<NullOr<IUser>> {
    return this.model
      .findOne({ email, archived: false })
      .select('-password -avatar -archived -createdAt -updatedAt')
      .exec();
  }

  async getAll (query: string): Promise<IUser[]> {
    return this.model
      .find({
        $or: [
          { fullname: { $regex: query, $options: 'i' } },
          { username: { $regex: query, $options: 'i' } }
        ],
        archived: false
      })
      .select('-password -avatar -archived -createdAt -updatedAt')
      .exec();
  }

  async create (payload: ICreateUserPayload): Promise<IUser> {
    const userDoc = await this.model.create({ ...payload });
    const user = {
      ...userDoc.toObject<IUser>(),
      password: undefined,
      avatar: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      archived: undefined
    };

    return user;
  }

  async update (payload: IUpdateUserPayload & { id: string, password?: string, }): Promise<NullOr<IUser>> {
    const user = await this.model
      .findOneAndUpdate({ _id: payload.id }, { ...payload }, { new: true })
      .select('-password -avatar -archived -createdAt -updatedAt')
      .exec();
    return user;
  }

  async delete (userId: string): Promise<string | null> {
    const deletedUser = await this.model.findOneAndUpdate({ _id: userId }, { archived: true }).exec();
    if (!deletedUser) {
      return null;
    }

    return deletedUser.id;
  }
}
