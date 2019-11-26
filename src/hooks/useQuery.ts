import {useContext, useEffect, useMemo} from 'react';

import {QueryConfig, QueryState} from '../types';
import {Context} from '../components/Context';
import {checkKey, checkQueryConfig, getQueryKey, getQueryState} from '../utils';

export const useQuery = <Body = unknown, Error = unknown>(queryConfig?: QueryConfig): QueryState<Body, Error> => {
  const {
    start,
    state,
    cancel,
  } = useContext(Context);

  const [key, queryState] = useMemo(() => {
    const key = getQueryKey(queryConfig);
    const queryState = getQueryState<Body, Error>(state, key);

    return [key, queryState];
  }, [queryConfig, state]);

  useEffect(() => {
    if (checkQueryConfig(queryConfig) && checkKey(key)) {
      start(queryConfig, key);

      return () => {
        cancel(queryConfig, key);
      }
    }
  }, [cancel, key, queryConfig, start]);

  return queryState;
};
