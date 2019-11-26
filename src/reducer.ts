import {cancel, error, start, success} from './actions';
import {DefaultPayload, ErrorPayload, State, SuccessPayload} from './types';
import {createReducer, initialState} from './utils';

const startReducer = (state: State, {key}: DefaultPayload): State => {
  const currentState = state[key as string];

  if (currentState) {
    return {
      ...state,
      [key]: {
        ...currentState,
        queryState: {
          ...currentState.queryState,
          loading: true,
        },
        mountedComponents: currentState.mountedComponents + 1,
      },
    };
  }

  return {
    ...state,
    [key]: {
      queryState: {
        ...initialState,
        loading: true,
      },
      mountedComponents: 1,
    },
  };
};

const successReducer = (state: State, {key, data}: SuccessPayload): State => {
  const currentState = state[key as string];

  if (currentState) {
    return {
      ...state,
      [key]: {
        ...currentState,
        queryState: {
          ...currentState.queryState,
          loading: false,
          error: null,
          data,
        },
      },
    };
  }

  return state;
};

const errorReducer = (state: State, {key, error}: ErrorPayload): State => {
  const currentState = state[key as string];

  if (currentState) {
    return {
      ...state,
      [key]: {
        ...currentState,
        queryState: {
          ...currentState.queryState,
          loading: false,
          error,
        },
      },
    };
  }

  return state;
};

const cancelReducer = (state: State, {key}: DefaultPayload): State => {
  const currentState = state[key as string];

  if (currentState && currentState.mountedComponents > 1) {
    return {
      ...state,
      [key]: {
        ...currentState,
        mountedComponents: currentState.mountedComponents - 1,
      },
    };
  }

  const {
    // @ts-ignore TS2538: Type 'symbol' cannot be used as an index type.
    [key]: omittedKey,
    ...restState
  } = state;

  return restState;
};

export const reducer = createReducer<State>({
  [`${start}`]: startReducer,
  [`${success}`]: successReducer,
  [`${error}`]: errorReducer,
  [`${cancel}`]: cancelReducer,
});
