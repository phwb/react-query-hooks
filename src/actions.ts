import {RequestFunction} from './types';

interface IBaseAction {
  request: RequestFunction;
}

interface ISuccessAction extends IBaseAction {
  data: any
}

interface IErrorAction extends IBaseAction {
  error: any;
}

export class Container<T = any> {
  readonly $value: T;

  constructor(x: T) {
    this.$value = x;
  }

  static of(x: any) {
    throw new Error('need to implement');
  }
}

export class StartAction extends Container<IBaseAction> {
  static of(x: IBaseAction) {
    return new StartAction(x);
  }
}

export class CancelAction extends Container<IBaseAction> {
  static of(x: IBaseAction) {
    return new CancelAction(x);
  }
}

export class SuccessAction extends Container<ISuccessAction> {
  static of(x: ISuccessAction) {
    return new SuccessAction(x);
  }
}

export class ErrorAction extends Container<IErrorAction> {
  static of(x: IErrorAction) {
    return new ErrorAction(x);
  }
}

