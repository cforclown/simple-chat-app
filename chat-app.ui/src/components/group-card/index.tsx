import { IChannel } from '../../store/reducers/channels';
import UserAvatar from '../user-avatar';
import { Label } from '../ui/label';

interface IGroupCard {
  channel: IChannel
}

function GroupCard({ channel }: IGroupCard): JSX.Element {
  return (
    <div className="w-full flex flex-row justify-start items-center gap-2">
      <UserAvatar size="xl" src={channel.id}/>
      <Label className="font-bold">{channel.name}</Label>
    </div>
  );
}

export default GroupCard;
