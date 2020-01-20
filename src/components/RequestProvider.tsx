import React, {useCallback, useReducer} from 'react';

import {CancelAction, ErrorAction, StartAction, SuccessAction} from '../actions';
import {RequestContext, RequestFunction, State} from '../types';
import {reducer} from '../reducer';
import {Context} from './Context';

const initialState: State = new Map();

export const RequestProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const start = useCallback((request: RequestFunction) => {
    dispatch(StartAction.of({
      request,
    }));

    request().then((data: any) => {
      dispatch(SuccessAction.of({
        request,
        data,
      }));
    }).catch((error: any) => {
      dispatch(ErrorAction.of({
        request,
        error,
      }));
    });
  }, []);
  const cancel = useCallback((request: RequestFunction) => {
    dispatch(CancelAction.of({
      request,
    }));
  }, []);
  const context: RequestContext = {
    start,
    cancel,
    state,
  };

  return <Context.Provider value={context} children={children}/>;
};
