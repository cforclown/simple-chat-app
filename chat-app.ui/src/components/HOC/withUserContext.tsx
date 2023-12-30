import { useSelector } from 'react-redux';
import { useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { IUserContext } from 'chat-app.contracts';
import Loader from '../loader/Loader.style';
import { selectUserContext } from '@/store/reducers/user-context/user-context-selectors';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

export interface IWithUserContext {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  t: TFunction<'translation', undefined>;
  navigate: NavigateFunction;
  userContext: IUserContext;
}

function withUserContext<P extends IWithUserContext>(Component: React.ComponentType<P>) {
  return (props: Omit<P, keyof IWithUserContext>) => {
    const [ loading, setLoading ] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const userContext = useSelector(selectUserContext());

    if (!userContext) {
      return <Loader />;
    }

    return (
      <Component
        {...props as P}
        loading={loading}
        setLoading={setLoading}
        t={t} 
        navigate={navigate}
        userContext={userContext}
      />
    );
  };
}

export default withUserContext;
