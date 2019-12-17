import {cancel, error, start, success} from './actions';
import {CancelPayload, DefaultPayload, ErrorPayload, State, SuccessPayload} from './types';
import {createReducer, initialState} from './utils';

const startReducer = (state: State, {key, query}: DefaultPayload): State => {
  const currentState = state[key as string];
  const mountedComponents = currentState
    ? currentState.mountedComponents + 1
    : 1;

  if (currentState && !query.reset) {
    return {
      ...state,
      [key]: {
        ...currentState,
        mountedComponents,
        queryState: {
          ...currentState.queryState,
          loading: true,
        },
      },
    };
  }

  return {
    ...state,
    [key]: {
      mountedComponents,
      queryState: {
        ...initialState,
        loading: true,
      },
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

const cancelReducer = (state: State, {key, cleanup}: CancelPayload): State => {
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

  // cleanup устанавливается при анмаунте компонента
  if (cleanup) {
    const {
      [key as string]: omittedKey,
      ...restState
    } = state;

    return restState;
  }

  return state;
};

export const reducer = createReducer<State>({
  [`${start}`]: startReducer,
  [`${success}`]: successReducer,
  [`${error}`]: errorReducer,
  [`${cancel}`]: cancelReducer,
});
