import {useEffect} from 'react';

import {RequestFunction, RequestOptions, RequestState} from '../types';
import {initialQueryState} from '../reducer/start';
import {useRequestContext} from './useRequestContext';

export const useRequest = <Data = unknown>(
  request?: RequestFunction<Data>,
  options: RequestOptions = {},
): RequestState<Data> => {
  const {
    start,
    cancel,
    state,
  } = useRequestContext<Data>();
  const {
    reset = true,
  } = options;
  const queryState = request && state.get(request);

  useEffect(() => {
    if (request && reset) {
      start(request);

      return () => {
        cancel(request);
      };
    }
  }, [cancel, request, reset, start]);

  return queryState || initialQueryState;
};
