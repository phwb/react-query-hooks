import {useContext} from 'react';

import {Context} from '../components/Context';
import {MayBeRequestContext, RequestContext} from '../types';

export const useRequestContext = <Data>(): RequestContext<Data> => {
  const contextValue = useContext<MayBeRequestContext>(Context);

  if (!contextValue) {
    throw new window.Error(
      'could not find react-query-hooks context value; please ensure the component is wrapped in a <RequestProvider>',
    );
  }

  return contextValue;
};
