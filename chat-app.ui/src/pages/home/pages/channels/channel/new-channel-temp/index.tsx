import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IUser } from 'chat-app.contracts';
import OverflowContainer from '@/components/overflow-container';
import MessageForm from '../message-form';
import { startConversation } from '../../channels.service';
import useAction from '@/hooks/useAction';
import { setSelectedChannelAction } from '@/store/reducers/channels/channels-actions';
import { selectSelectedChannel } from '@/store/reducers/channels/channels-selectors';
import { IChannel } from '@/store/reducers/channels';

export interface IChatContainerTemp {
  recipient: IUser;
}

function ChatContainerTemp({ recipient }: IChatContainerTemp): JSX.Element {
  const navigate = useNavigate();
  const selectedChannel = useSelector(selectSelectedChannel());
  const setSelectedChannel = useAction(setSelectedChannelAction);
  const msgsContainerRef = useRef<HTMLDivElement>(null);
  const [channel, setChannel] = useState<IChannel | null>(null);

  // wait for store state to changed then navigate to created channel
  useEffect(() => {
    if (!channel || selectedChannel?.id === 'new') {
      return;
    }

    navigate(`/channels/${channel.id}`);
  }, [channel, selectedChannel]);

  const onSubmit = async (text: string): Promise<void> => {
    const newChannel = await startConversation(recipient.id, text);
    setSelectedChannel(newChannel);
    setChannel(newChannel);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-start relative overflow-hidden">
      <OverflowContainer ref={msgsContainerRef} className="px-5" onScroll={() => {}} />
      <MessageForm submit={onSubmit} />
    </div>
  );
}

export default ChatContainerTemp;
