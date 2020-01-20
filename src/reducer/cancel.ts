import {State} from '../types';
import {CancelAction} from '../actions';

export const cancel = (state: State, action: CancelAction): State => {
  const {request} = action.$value;
  const nextState = new Map(state);
  const requestState = state.get(request);

  if (requestState && requestState.__counter > 1) {
    return nextState.set(request, {
      ...requestState,
      __counter: requestState.__counter - 1,
    });
  }

  if (nextState.delete(request)) {
    return nextState;
  }

  return state;
};
