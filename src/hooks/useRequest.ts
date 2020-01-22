import {useEffect} from 'react';

import {RequestFunction, RequestOptions, RequestState} from '../types';
import {initialQueryState} from '../reducer/start';
import {useRequestContext} from './useRequestContext';

export const useRequest = <D = unknown, E = Error>(
  request?: RequestFunction<D>,
  options: RequestOptions = {},
): RequestState<D, E> => {
  const {
    start,
    cancel,
    state,
  } = useRequestContext<D>();
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
