import UserAvatar from '../user-avatar';
import { Label } from '../ui/label';
import { IUser } from 'chat-app.contracts';

interface IUserCard {
  user: IUser;
}

function UserCard({ user }: IUserCard) {
  return (
    <div className="w-full flex flex-row justify-start items-center gap-2">
      <UserAvatar size="lg" src={user.id}/>
      <div className="flex flex-col justify-center items-start gap-1">
        <Label className="font-bold">{user.fullname}</Label>
        <Label>{user.username}</Label>
      </div>
    </div>
  );
}

export default UserCard;
