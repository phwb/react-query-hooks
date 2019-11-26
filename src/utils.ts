import {QueryConfig, QueryState, State} from './types';

export const initialState: QueryState<any, any> = {
  loading: false,
  error: null,
  data: null,
};

export const getQueryKey = (queryConfig?: QueryConfig): PropertyKey | undefined => {
  if (!queryConfig) {
    return;
  }

  if ('key' in queryConfig) {
    return queryConfig.key;
  }

  return JSON.stringify({
    url: queryConfig.url,
    body: queryConfig.body,
  });
};

export const getQueryState = <T, K>(state: State, key?: PropertyKey): QueryState<T, K> => (
  key && key in state
    ? state[key as string].queryState
    : initialState
);

export const checkQueryConfig = (queryConfig?: QueryConfig): queryConfig is QueryConfig => {
  return !!(queryConfig && queryConfig.loadOnMount !== false);
};

export const checkKey = (key?: PropertyKey): key is PropertyKey => !!key;

export const createReducer = <S>(reducers: any) => (state: S, action: any): S => {
  const {
    type,
    payload,
  } = action;
  const reducer = reducers[type];

  return reducer(state, payload);
};

export const createAction = <P>(type: string) => {
  const action = (payload: P) => ({
    type,
    payload,
  });
  action.toString = () => type;

  return action;
};
