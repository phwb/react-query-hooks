import React from 'react';
import {fetchClient, QueryConfig, QueryProvider, useQuery} from '..';
import {storiesOf} from '@storybook/react';

const config: QueryConfig = {
  url: 'https://randomuser.me/api/',
};

const Error: React.FC = () => {
  const {error} = useQuery(config);

  if (error) {
    return (
      <pre>{error.toString()}</pre>
    );
  }

  return (
    <div>disable network</div>
  )
};

storiesOf('Simple usage', module).add('error handler', () => (
  <QueryProvider client={fetchClient('json')}>
    <Error/>
  </QueryProvider>
));

