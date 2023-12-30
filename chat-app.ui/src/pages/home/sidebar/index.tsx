import { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Sidebar as ReactProSidebar } from 'react-pro-sidebar';
import { selectTheme } from '@/store/reducers/layout/theme-selectors';
import SidebarHeader from './sidebar-header';
import { IUser } from 'chat-app.contracts';
import withUserContext, { IWithUserContext } from '@/components/HOC/withUserContext';
import { selectChannels } from '@/store/reducers/channels/channels-selectors';
import SidebarFooter from './sidebar-footer';
import SidebarContentChannels from './sidebar-content/sidebar-content-channels';
import { IChannel } from '@/store/reducers/channels';

export interface ISidebar extends IWithUserContext {
  collapsed: boolean;
  hidden: boolean;
  onBreakpoint(onBreakpoint: boolean): void;
  onBackdropClick(): void;
  className?: string;
}

const Container = styled(ReactProSidebar)`
  background-color: ${props => props.theme.sidebar.bg};
  box-shadow: 1px 3px 6px #00000040;
`;

function Sidebar({ userContext: { user }, collapsed, onBreakpoint, onBackdropClick, hidden }: ISidebar): JSX.Element {
  const theme = useSelector(selectTheme());
  const ismounted = useRef(false);
  const channels = useSelector(selectChannels());
  const normalizedChannels: (IChannel & { withUser?: IUser })[] = useMemo(() => channels.map(channel => ({
    ...channel,
    withUser: channel.type === 'dm' ? channel.users.find(u => u.id !== user.id) : undefined
  })), [channels]);

  useEffect(() => {
    ismounted.current = true;
    return () => {
      ismounted.current = false;
    };
  }, []);

  return (
    <Container 
      width="220px"
      collapsed={collapsed} 
      toggled={!hidden}
      onBreakPoint={onBreakpoint}
      onBackdropClick={onBackdropClick}
      breakPoint="sm"
      backgroundColor={theme.sidebar.bg}
    >
      <div className="h-screen flex flex-col justify-start items-start">
        <SidebarHeader collapsed={collapsed} />
        <SidebarContentChannels channels={normalizedChannels} />
        <SidebarFooter />
      </div>
    </Container>
  );
}

export default withUserContext(Sidebar);
