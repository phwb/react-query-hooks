import React, {useCallback, useReducer, useRef} from 'react';

import {cancel, error, start, success} from '../actions';
import {reducer} from '../reducer';
import {CancelFunction, HttpMethod, ProviderProps, QueryConfig, QueryMode} from '../types';
import {Context} from './Context';

const initialState = Object.create(null);

export const QueryProvider: React.FC<ProviderProps> = ({client, children}) => {
  // кеш запросов для ключа mode, чтобы можно было диспатчить "все", "последний" или "первый" запрос
  const modeCache = useRef<Map<PropertyKey, any>>(new Map());
  const requestCache = useRef<Map<PropertyKey, CancelFunction>>(new Map());

  const [state, dispatch] = useReducer(reducer, initialState);
  const startRequest = useCallback((query: QueryConfig, key: PropertyKey) => {
    const successHandler = (response: any) => {
      const {
        delay,
        refresh,
        transform,
        mode,
      } = query;

      if (refresh && refresh(response)) {
        if (delay) {
          setTimeout(() => startRequest(query, key), delay());
        } else {
          startRequest(query, key);
        }

        return;
      }

      const data = typeof transform === 'function'
        ? transform(response)
        : response;
      const action = success({
        key,
        query,
        data,
      });

      // диспатчим только последний запрос
      if (mode === QueryMode.LAST) {
        if (modeCache.current.get(key) === query) {
          dispatch(action);
        }

        return;
      }

      // если не задан mode то диспатчим все запросы
      dispatch(action);
    };
    const errorHandler = (err: any) => {
      const {
        retry,
        delay,
      } = query;

      if (retry && retry(err)) {
        if (delay) {
          setTimeout(() => startRequest(query, key), delay());
        } else {
          startRequest(query, key);
        }

        return;
      }

      dispatch(error({
        key,
        query,
        error: err,
      }));
    };

    const {
      url,
      body,
      headers,
      method = HttpMethod.GET,
    } = query;
    const request = client(successHandler, errorHandler);
    const cancel = request(url, {
      body,
      headers,
      method,
    });

    requestCache.current.set(key, cancel);
    modeCache.current.set(key, query);

    dispatch(start({
      key,
      query,
    }));
  }, [client]);
  const cancelRequest = useCallback((query: QueryConfig, key: PropertyKey) => {
    const cancelRequest = requestCache.current.get(key);

    if (cancelRequest) {
      cancelRequest();
    }

    requestCache.current.delete(key);
    modeCache.current.delete(key);

    dispatch(cancel({
      key,
      query,
    }));
  }, []);

  const context = {
    state,
    start: startRequest,
    cancel: cancelRequest,
  };

  return (
    <Context.Provider value={context}>{children}</Context.Provider>
  );
};
