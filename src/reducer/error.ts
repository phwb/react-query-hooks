import {State} from '../types';
import {ErrorAction} from '../actions';

export const error = (state: State, action: ErrorAction): State => {
  const {request, error} = action.$value;
  const requestState = state.get(request);

  if (requestState) {
    return new Map(state).set(request, {
      ...requestState,
      loading: false,
      error,
    });
  }

  return state;
};
