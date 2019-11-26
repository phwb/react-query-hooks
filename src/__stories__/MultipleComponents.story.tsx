import React, {useMemo, useState} from 'react';
import {fetchClient, QueryConfig, QueryProvider, useQuery} from '..';
import {storiesOf} from '@storybook/react';

const style: React.CSSProperties = {
  display: 'flex',
  width: 500,
  justifyContent: 'space-between',
};
const key = Symbol('key');
const toRequest = (withoutQuery?: boolean): QueryConfig => ({
  url: 'https://randomuser.me/api/?seed=foobar&inc=name',
  key,
  ...withoutQuery && {
    loadOnMount: false,
  },
});

const FirstLoader: React.FC<any> = ({children, text}) => {
  const [config, setConfig] = useState(toRequest());
  const {
    data,
    loading,
  } = useQuery(config);

  return (
    <div>
      {loading && (
        <div>{text}</div>
      )}
      {data && (
        <>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <div>{children}</div>
        </>
      )}
      <button onClick={() => setConfig(toRequest())}>update component</button>
    </div>
  );
};

const SecondLoader: React.FC<any> = ({children, text, withoutQuery}) => {
  const config = useMemo(() => toRequest(withoutQuery), [withoutQuery]);
  const {
    data,
    loading,
  } = useQuery(config);

  return (
    <div>
      {loading && (
        <div>{text}</div>
      )}
      {data && (
        <>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <div>{children}</div>
        </>
      )}
    </div>
  );
};

const MultipleComponents = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div style={style}>
      <FirstLoader text="loading first..."/>
      {visible && (
        <SecondLoader text="loading second...">
          <button onClick={() => setVisible(false)}>unmount second</button>
        </SecondLoader>
      )}
      {!visible && (
        <div>
          <button onClick={() => setVisible(true)}>mount second</button>
        </div>
      )}
    </div>
  );
};

const MultipleWithoutQuery: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [withoutQuery, setWithout] = useState(true);

  return (
    <div style={style}>
      <FirstLoader text="loading first..."/>
      {visible && (
        <SecondLoader text="loading second..." withoutQuery={withoutQuery}>
          {withoutQuery && (
            <button onClick={() => setWithout(false)}>do request</button>
          )}
          <button
            onClick={() => {
              setVisible(false);
              setWithout(true);
            }}
          >
            unmount second
          </button>
        </SecondLoader>
      )}
      {!visible && (
        <div>
          <button onClick={() => setVisible(true)}>mount second</button>
        </div>
      )}
    </div>
  );
};

storiesOf('Multiple components', module).add('load on mount', () => (
  <QueryProvider client={fetchClient('json')}>
    <MultipleComponents/>
  </QueryProvider>
)).add('показать стейт без запроса', () => (
  <QueryProvider client={fetchClient('json')}>
    <MultipleWithoutQuery/>
  </QueryProvider>
));
