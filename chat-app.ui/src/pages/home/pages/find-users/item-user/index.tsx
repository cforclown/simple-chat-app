import { useCallback } from 'react';
import withUserContext, { IWithUserContext } from '@/components/HOC/withUserContext';
import { Button } from '@/components/ui/button';
import UserCard from '@/components/user-card';
import useAction from '@/hooks/useAction';
import { setSelectedChannel as setSelectedChannelAction } from '@/store/reducers/channels';
import { IUser } from 'chat-app.contracts';
import { useSelector } from 'react-redux';
import { selectChannels } from '@/store/reducers/channels/channels-selectors';

interface IItemUser extends IWithUserContext{
  user: IUser;
}

function ItemUser({ userContext, user, t, navigate }: IItemUser) {
  const channels = useSelector(selectChannels());
  const setSelectedChannel = useAction(setSelectedChannelAction);

  const onChatBtnClick = useCallback(() => {
    let currentChannel = channels.find(c => c.type === 'dm' && c.users.find(u => u.id === user.id));
    if (!currentChannel) {
      currentChannel = {
        _id: 'new',
        id: 'new',
        type: 'dm',
        users: [userContext.user, user],
        messages: []
      };
    }
    setSelectedChannel(currentChannel);
    navigate(`/channels/${currentChannel.id}`, { 
      state: currentChannel.id === 'new' ? {
        user: { ...user },
        channel: currentChannel
      } : undefined
    });
  }, [userContext, user]);
  return (
    <div className="w-full flex justify-between items-center p-2 border-2 rounded-md">
      <UserCard user={user} />
      <Button onClick={onChatBtnClick}>
        {t('common.chat')}
      </Button>
    </div>
  );
}

export default withUserContext(ItemUser);
