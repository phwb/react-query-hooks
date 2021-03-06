import {CancelAction, Container, ErrorAction, StartAction, SuccessAction} from './actions';

export type RequestFunction<T = any> = (...args: any[]) => Promise<T>;
export type PredicateFunction = (value: any) => boolean;
export type PromiseFunction<T> = (...args: any[]) => Promise<T>;

export interface RequestState<D = unknown, E = unknown> {
  readonly __counter: number;
  readonly loading: boolean;
  readonly data?: D;
  readonly error?: E;
}

export type State = Map<RequestFunction, RequestState<any, any>>;

export interface RequestContext<Data = unknown> {
  start: (request: RequestFunction) => void;
  cancel: (request: RequestFunction) => void;
  state: State;
}

export type MayBeRequestContext = RequestContext<any> | null;

export interface RequestOptions {
  reset?: boolean;
}

export type AnyAction =
  | StartAction
  | CancelAction
  | SuccessAction
  | ErrorAction
  | Container;
