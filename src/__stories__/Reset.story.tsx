import React, {useState} from 'react';
import {fetchClient, QueryConfig, QueryProvider, useQuery} from '..';
import {storiesOf} from '@storybook/react';

const toRequest = (reset: boolean): QueryConfig => ({
  url: 'https://randomuser.me/api/?inc=name',
  reset,
});

const Error: React.FC = () => {
  const [reset, setReset] = useState(false);
  const [config, setConfig] = useState(toRequest(reset));
  const {
    data,
    loading,
  } = useQuery(config);

  return (
    <>
      <div>
        <label>
          <input type="checkbox" onChange={() => setReset(!reset)} checked={reset}/>
          {` reset data`}
        </label>
      </div>
      <div>
        <button onClick={() => setConfig(toRequest(reset))}>update</button>
      </div>
      {loading && (
        <div>loading</div>
      )}
      {data && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </>
  );
};

storiesOf('Simple usage', module).add('reset data on update', () => (
  <QueryProvider client={fetchClient('json')}>
    <Error/>
  </QueryProvider>
));

