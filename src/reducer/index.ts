import {AnyAction, State} from '../types';
import {CancelAction, ErrorAction, StartAction, SuccessAction} from '../actions';
import {start} from './start';
import {success} from './success';
import {error} from './error';
import {cancel} from './cancel';

export const reducer = (state: State, action: AnyAction): State => {
  if (action instanceof StartAction) {
    return start(state, action);
  }

  if (action instanceof SuccessAction) {
    return success(state, action);
  }

  if (action instanceof ErrorAction) {
    return error(state, action);
  }

  if (action instanceof CancelAction) {
    return cancel(state, action);
  }

  return state;
};
