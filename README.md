# React Query Hooks

## Installation (not published yet)

React Query Hooks requires **React 16.8.3 or later**.

```
npm install --save @yandex-taxi/react-query-hooks
```

## Providing the Client

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import {fetchClient, QueryProvider} from '@yandex-taxi/react-query-hooks';

ReactDOM.render(
  <QueryProvider client={fetchClient('json')}>
    <SimpleQuery/>
  </QueryProvider>,
  document.getElementById('root')
)
```

## Usage

**Note**: `config` object always should be memoized.

#### Load data on mount
```jsx
import React from 'react'
import {useQuery} from '@yandex-taxi/react-query-hooks';

const config = {
  url: 'https://randomuser.me/api/',
};

const SimpleQuery = () => {
  const {data, loading} = useQuery(config);

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
```

#### Simple mutation
```jsx
import React, {useState} from 'react';
import {useQuery} from '@yandex-taxi/react-query-hooks';

const toMutationRequest = (seed: string): QueryConfig => ({
  url: `https://randomuser.me/api/?seed=${seed}`,
});

const SimpleMutation = () => {
  const [seed, setSeed] = useState('foobar');
  const [config, setConfig] = useState();
  const {data, loading} = useQuery(config);

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
        <button type="submit">load</button>
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
```
