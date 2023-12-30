import { selectTheme } from '@/store/reducers/layout/theme-selectors';
import { Menu, menuClasses } from 'react-pro-sidebar';
import { useSelector } from 'react-redux';
import { IUser } from 'chat-app.contracts';
import SidebarItemChannel from '../sidebar-item-channel';
import OverflowContainer from '@/components/overflow-container';
import { IChannel } from '@/store/reducers/channels';

interface ISidebarContentChannels {
  channels: (IChannel & { withUser?: IUser })[];
}

function SidebarContentChannels({ channels }: ISidebarContentChannels) {
  const theme = useSelector(selectTheme());

  return (
    <OverflowContainer>
      <Menu 
        className="w-full" 
        menuItemStyles={{
          button: {
            height: 68,
            color: theme.sidebar.textColor,
            backgroundColor: theme.sidebar.bg,
            padding: '0 12px',
            '&:hover': {
              color: theme.sidebar.itemActiveTextColor,
              backgroundColor: theme.sidebar.itemActiveBg,
            },
            [`&.${menuClasses.active}`]: {
              color: theme.sidebar.itemActiveTextColor,
              backgroundColor: theme.sidebar.itemActiveBg,
            },
          },
        }}
      >
        {channels.map((channel, i) => (
          <SidebarItemChannel key={i} channel={channel} user={channel.withUser} />
        ))}
      </Menu>
    </OverflowContainer>
  );
}

export default SidebarContentChannels;
