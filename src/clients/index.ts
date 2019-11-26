import {ClientFunction} from '../types';

type BodyType = 'json' | 'text' | 'blob';

export const fetchClient = (type: BodyType): ClientFunction => {
  return (onSuccess, onError) => {
    return (url, options) => {
      const controller = new AbortController();

      fetch(url, {...options, signal: controller.signal})
        .then(response => response[type]())
        .then(onSuccess)
        .catch(onError);

      return () => {
        controller.abort();
      };
    };
  };
};

export const webSocketClient = (ws: WebSocket): ClientFunction => {
  return (onSuccess, onError) => {
    ws.onmessage = onSuccess;
    ws.onerror = onError;

    return (url, options) => {
      if (options && typeof options.body === 'string') {
        ws.send(options.body);
      }

      return () => {};
    };
  };
};
