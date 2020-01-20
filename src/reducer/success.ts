import {State} from '../types';
import {SuccessAction} from '../actions';

export const success = (state: State, action: SuccessAction): State => {
  const {request, data} = action.$value;
  const requestState = state.get(request);

  if (requestState) {
    return new Map(state).set(request, {
      ...requestState,
      error: undefined,
      loading: false,
      data,
    });
  }

  return state;
};
