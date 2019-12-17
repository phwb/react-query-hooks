import React, {useMemo, useState} from 'react';
import {fetchClient, QueryConfig, QueryProvider, useQuery} from '..';
import {storiesOf} from '@storybook/react';

const style: React.CSSProperties = {
  display: 'flex',
  width: 500,
  justifyContent: 'space-between',
};
const key = Symbol('key');
const toRequest = (loadOnMount = true, reset = false): QueryConfig => ({
  url: 'https://randomuser.me/api/?inc=name',
  key,
  loadOnMount,
  reset,
});

const FirstLoader: React.FC<any> = ({children, text, reset}) => {
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
      <button onClick={() => setConfig(toRequest(undefined, reset))}>update component</button>
    </div>
  );
};

const SecondLoader: React.FC<any> = ({children, text, loadOnMount}) => {
  const config = useMemo(() => toRequest(loadOnMount), [loadOnMount]);
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
  const [reset, setReset] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loadOnMount, setLoadOnMount] = useState(false);

  return (
    <>
      <div>
        <label>
          <input type="checkbox" checked={reset} onChange={() => setReset(!reset)}/>
          {` reset data`}
        </label>
      </div>
      <div style={style}>
        <FirstLoader text="loading first..." reset={reset}/>
        {visible && (
          <SecondLoader text="loading second..." loadOnMount={loadOnMount}>
            {!loadOnMount && (
              <button onClick={() => setLoadOnMount(true)}>do request</button>
            )}
            <button
              onClick={() => {
                setVisible(false);
                setLoadOnMount(false);
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

    </>
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
