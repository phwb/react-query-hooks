import {RequestState, State} from '../types';
import {StartAction} from '../actions';

export const initialQueryState: RequestState<any> = {
  __counter: 1,
  loading: false,
  data: null,
};

export const start = (state: State, action: StartAction): State => {
  const {request} = action.$value;
  const nextState = new Map(state);
  const requestState = state.get(request);

  if (requestState) {
    return nextState.set(request, {
      ...requestState,
      loading: true,
      __counter: requestState.__counter + 1,
    });
  }

  return nextState.set(request, {
    ...initialQueryState,
    loading: true,
  });
};
