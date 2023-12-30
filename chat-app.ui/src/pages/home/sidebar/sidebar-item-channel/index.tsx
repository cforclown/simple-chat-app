import { matchPath, useNavigate } from 'react-router-dom';
import { MenuItem } from 'react-pro-sidebar';
import styled from 'styled-components';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import UserAvatar from '@/components/user-avatar';
import { IUser } from 'chat-app.contracts';
import { IChannel } from '@/store/reducers/channels';

interface ISidebarMenuItem {
  channel: IChannel;
  user?: IUser;
}

const Container = styled.div`
  color: ${({ theme }) => theme.sidebar.itemTextColor};

  > label {
    max-width: 132px;
    text-overflow: ellipsis;
    overflow: hidden;

    &.last-msg {
      color: ${({ theme }) => theme.sidebar.itemTextColor}bb;
    }
  }
`;

export default function SidebarItemChannel({ channel, user }: ISidebarMenuItem): JSX.Element {
  const navigate = useNavigate();

  return (
    <MenuItem 
      active={!!matchPath(`/channels/${channel.id}`, location.pathname)} 
      onClick={() => navigate(`/channels/${channel.id}`)}
    >
      <div className="relative flex flex-row justify-start items-center gap-2">
        <UserAvatar className="my-4" size="xl" src={user?.id ?? channel.id} />
        <Container className="flex flex-col justify-center items-start gap-1">
          <Label className="font-bold">{user?.fullname ?? channel.name}</Label>
          <Label className="last-msg">{channel.lastMessage}</Label>
        </Container>
        {(channel.unreadMessages && channel.unreadMessages > 0) ? (
          <div className="absolute right-0 h-full flex justify-center items-center">
            <Badge variant="destructive" className="px-2 py-1">{channel.unreadMessages}</Badge>
          </div>
        ) : null}
      </div>
    </MenuItem>
  );
}
