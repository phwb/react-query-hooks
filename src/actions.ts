import {CancelPayload, DefaultPayload, ErrorPayload, SuccessPayload} from './types';
import {createAction} from './utils';

export const start = createAction<DefaultPayload>('start');
export const success = createAction<SuccessPayload>('success');
export const error = createAction<ErrorPayload>('error');
export const cancel = createAction<CancelPayload>('cancel');
