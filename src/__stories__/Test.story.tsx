import {storiesOf} from '@storybook/react';
import React, {useCallback, useEffect, useState} from 'react';

import {RequestFunction, useRequest, RequestProvider} from '..';
import {RandomUserName, RandomUserResponse} from './types';

const toClient = (res: RandomUserResponse): RandomUserName => res.results[0].name;
const fetchFooUser: RequestFunction = (id: string = '') => {
  return fetch(`https://randomuser.me/api?inc=name&seed=foo${id}`).then(response => response.json()).then(toClient);
};
const fetchRandomUser = (): Promise<RandomUserName> => {
  return fetch('https://randomuser.me/api?inc=name').then(response => response.json()).then(toClient);
};

const TestQuery0: React.FC = () => {
  const {
    loading,
    data,
  } = useRequest(fetchFooUser);

  return (
    <>
      {loading && (
        <div>loading...</div>
      )}
      {data && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </>
  );
};

const TestQuery1point1: React.FC = () => {
  const [counter, setCounter] = useState(0);
  const {
    loading,
    data,
  } = useRequest(fetchRandomUser);

  if (loading) {
    return 'loading...' as any;
  }

  return (
    <div>
      <div>
        <button onClick={() => setCounter(counter - 1)}>dec</button>
        {` ${counter} `}
        <button onClick={() => setCounter(counter + 1)}>inc</button>
      </div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

const TestQuery1point2: React.FC<any> = ({reset}: { reset: boolean }) => {
  const {
    loading,
    data,
  } = useRequest(fetchRandomUser, {reset});

  if (loading) {
    return 'loading...' as any;
  }

  return (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  );
};

const TestQuery2: React.FC = () => {
  const [id, setId] = useState<number>(0);
  const request = useCallback(() => fetchFooUser(`${id}`), [id]);
  const {
    loading,
    data,
  } = useRequest(request);

  return (
    <>
      {loading && (
        <div>loading...</div>
      )}
      {data && (
        <div>
          <button onClick={() => setId(id - 1)}>prev user</button>
          {` current id: ${id} `}
          <button onClick={() => setId(id + 1)}>next user</button>
          <h1>Hello, {`${data.title} ${data.first} ${data.last}`}!</h1>
        </div>
      )}
    </>
  );
};

const fetchThrottled: RequestFunction = (i: number): Promise<number> => new Promise<number>(resolve => {
  setTimeout(() => {
    fetchFooUser(`${i}`).then(resolve);
  }, 1000);
});
const TestQueryMode: React.FC<any> = ({i}: { i: number }) => {
  const request = useCallback(() => fetchThrottled(i), [i]);
  const {
    loading,
    data,
  } = useRequest(request);

  if (loading) {
    return 'loading...' as any;
  }

  return (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  );
};

storiesOf('Test query by function', module).add('on mount', () => {
  const [visibleTest0, setVisibleTest0] = useState(true);
  const [visible, setVisible] = useState(false);
  const [reset, setLoad] = useState(false);

  return (
    <RequestProvider>
      <h2>Test 0 (static)</h2>
      <div>
        <button onClick={() => setVisibleTest0(!visibleTest0)}>{visibleTest0 ? 'hide' : 'show'} Test 0</button>
      </div>
      {visibleTest0 && (
        <TestQuery0/>
      )}
      <h2>Test 1 (two components)</h2>
      <div>
        <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'show'}</button>
        {' '}
        <label>
          <input type="checkbox" checked={reset} onChange={() => setLoad(!reset)}/>
          {` reset on mount?`}
        </label>
      </div>
      <TestQuery1point1/>
      {visible && (
        <>
          <hr/>
          <TestQuery1point2 reset={reset}/>
        </>
      )}
      <h2>Test 2 (update on button click)</h2>
      <TestQuery2/>
    </RequestProvider>
  );
}).add('last mode', () => {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (i < 3) {
      setI(i + 1);
    }
  }, [i]);

  return (
    <RequestProvider>
      <TestQueryMode i={i}/>
    </RequestProvider>
  );
});
