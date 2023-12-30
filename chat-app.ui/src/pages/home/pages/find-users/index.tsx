import OverflowContainer from '@/components/overflow-container';
import SearchInput from '@/components/ui/search-input';
import HomeContentWrapper from '@/components/wrappers/HomeContentWrapper';
import { useAPI } from '@/hooks/useApi';
import { getAPIEndpoint } from '@/utils/call-api';
import { IUser } from 'chat-app.contracts';
import { useMemo, useState } from 'react';
import ItemUser from './item-user';
import withUserContext, { IWithUserContext } from '@/components/HOC/withUserContext';

function FinrUSers({ userContext: { user }, t }: IWithUserContext) {
  const [query, setQuery] = useState('');
  const endpoint = useMemo(() => getAPIEndpoint(`/users?query=${query}`), [query]);
  const { data } = useAPI<IUser[]>(endpoint);

  const users: IUser[] = useMemo(() => data ? [...data].filter(u => u.id !== user.id) : [], [data]);
  
  return (
    <HomeContentWrapper className="w-full flex flex-col justify-start items-center gap-8">
      <SearchInput 
        submitsearch={setQuery}
        placeholder={t('common.findUSers')}
        withClearBtn
      />
      <OverflowContainer className="gap-2">
        {users.map((u, i) => (
          <ItemUser key={i} user={u} />
        ))}
      </OverflowContainer>
    </HomeContentWrapper>
  );
}

export default withUserContext(FinrUSers);
