# React Query Hooks

## Установка

React Query Hooks requires **React 16.8.3 or later**.

```
npm install --save @yandex-taxi/react-query-hooks
```

## Разработка

Демо
```
npm start
```

## Использование

## Обернуть приложение в RequestProvider

```jsx harmony
import React from 'react'
import ReactDOM from 'react-dom'
import {RequestProvider} from '@yandex-taxi/react-query-hooks';

ReactDOM.render(
  <RequestProvider>
    <SimpleRequest/>
  </RequestProvider>,
  document.getElementById('root')
)
```

#### Загрузка данных

```jsx harmony
import React from 'react'
import {useRequest} from '@yandex-taxi/react-query-hooks';

const fetchRandomUser = () => fetch('https://randomuser.me/api?inc=name')
  .then(response => response.json())
  .then(response => response.results[0].name);

const SimpleRequest = () => {
  const { loading, data, error } = useRequest(fetchRandomUser);

  return (
    <>
      {loading && (
        <div>loading...</div>
      )}
      {data && (
        <h1>Hello, {`${data.title} ${data.first} ${data.last}`}!</h1>
      )}
    </>
  );
};
```

#### Загрузка данных с параметрами

```jsx harmony
import React from 'react'
import {useRequest} from '@yandex-taxi/react-query-hooks';

const fetchFooUser = (id) => fetch(`https://randomuser.me/api?inc=name&seed=foo${id}`)
  .then(response => response.json())
  .then(response => response.results[0].name);

const ParameterRequest = () => {
  const [id, setId] = useState(0);
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
```

## Публикация

```bash
npm version patch
npm run build
git push --follow-tags origin master && npm publish
```
