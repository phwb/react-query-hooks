import {storiesOf} from '@storybook/react';
import React, {FormEvent, useCallback, useEffect, useReducer, useState} from 'react';
import {QueryConfig, QueryProvider, useQuery, webSocketClient} from '..';

interface Data {
  message: string;
}

const toRequest = (body?: string): QueryConfig => ({
  url: 'fake/url',
  transform: (event: MessageEvent): Data => ({
    message: event.data,
  }),
  ...body && {
    body,
  },
});
const reducer = (state: string[], message: string): string[] => state.concat(message);

const SimpleWebSocket = () => {
  const [config, setConfig] = useState<QueryConfig>(toRequest());
  const [value, setValue] = useState<string>('');
  const [messages, setMessage] = useReducer(reducer, []);
  const {data} = useQuery<Data>(config);

  const submit = useCallback((event: FormEvent) => {
    event.preventDefault();

    if (value) {
      setMessage(`SEND: ${value}`);
      setConfig(toRequest(value));
    }
  }, [value]);

  useEffect(() => {
    if (data) {
      setMessage(`RECEIVED: ${data.message}`);
    }
  }, [data]);

  return (
    <div>
      <form onSubmit={submit}>
        <label>
          <b>Message:</b>
          <br/>
          <input onChange={event => setValue(event.target.value)} value={value}/>
        </label>
        <div>
          <button type="submit">Send</button>
        </div>
      </form>
      <br/>
      <div><b>Log:</b></div>
      {messages.map((message, i) => (
        <div key={i}>{message}</div>
      ))}
    </div>
  );
};

storiesOf('WebSocket', module).add('echo socket', () => {
  const socket = new WebSocket('wss://echo.websocket.org');

  useEffect(() => {
    return () => {
      socket.close();
    }
  }, [socket]);

  return (
    <QueryProvider client={webSocketClient(socket)}>
      <SimpleWebSocket/>
    </QueryProvider>
  )
});
