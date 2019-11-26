export enum QueryMode {
  LAST = 'last',
}

export enum HttpMethod {
  POST = 'POST',
  GET = 'GET',
}

export type BooleanFunction = (...args: any[]) => boolean;
export type NumberFunction = (...args: any[]) => number;
export type AnyFunction = (...args: any[]) => any;

export type CancelFunction = VoidFunction;
export type RequestFunction = (url: string, options?: ClientOptions<any>) => CancelFunction;
export type ClientFunction = (onSuccess: AnyFunction, onError: AnyFunction) => RequestFunction;

export interface ClientOptions<Body> {
  body?: Body;
  method?: HttpMethod;
  headers?: Record<any, any>;
}

export interface ProviderProps {
  client: ClientFunction;
}

export interface QueryConfig<Body = unknown> extends ClientOptions<Body> {
  url: string;
  mode?: QueryMode;
  transform?: AnyFunction;
  key?: PropertyKey;
  delay?: NumberFunction;
  refresh?: BooleanFunction;
  retry?: BooleanFunction;
  loadOnMount?: boolean;
}

export type State = Record<PropertyKey, {
  queryState: QueryState<any, any>;
  mountedComponents: number;
}>;

export interface QueryState<Data, Error> {
  loading: boolean;
  error: Error;
  data: Data;
}

export interface DefaultPayload {
  key: PropertyKey;
  query: QueryConfig;
}

export interface SuccessPayload extends DefaultPayload {
  data: any;
}

export interface ErrorPayload extends DefaultPayload {
  error: any;
}
