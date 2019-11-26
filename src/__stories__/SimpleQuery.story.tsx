import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';
import {fetchClient, QueryConfig, QueryProvider, useQuery} from '..';
import {RandomUserResponse} from './types';

const queryConfig: QueryConfig = {
  url: 'https://randomuser.me/api/',
};

const SimpleQuery: React.FC = () => {
  const {
    data,
    loading,
  } = useQuery<RandomUserResponse>(queryConfig);

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

const toMutationRequest = (seed: string): QueryConfig => ({
  url: `https://randomuser.me/api/?seed=${seed}`,
});

const SimpleMutation = () => {
  const [seed, setSeed] = useState('foobar');
  const [config, setConfig] = useState();
  const {
    data,
    loading,
  } = useQuery<RandomUserResponse>(config);
  const text = data
    ? 'load again'
    : 'load data';

  return (
    <>
      <form
        onSubmit={event => {
          event.preventDefault();

          if (seed) {
            setConfig(toMutationRequest(seed));
          }
        }}
      >
        <input value={seed} onChange={(event => setSeed(event.target.value))} placeholder="seed"/>
        <button type="submit">{text}</button>
      </form>
      {loading && (
        <div>loading...</div>
      )}
      {data && (
        <pre>{JSON.stringify(data.results[0], null, 2)}</pre>
      )}
    </>
  );
};

const json = fetchClient('json');

storiesOf('Simple usage', module).add('on mount', () => (
  <QueryProvider client={json}>
    <SimpleQuery/>
  </QueryProvider>
)).add('mutation', () => (
  <QueryProvider client={json}>
    <SimpleMutation/>
  </QueryProvider>
));
