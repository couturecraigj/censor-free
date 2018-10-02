import React from 'react';
import { Helmet } from 'react-helmet';
import ErrorMessage from '../../components/ErrorMessage';

export default () => (
  <div>
    <Helmet>
      <title>Error</title>
    </Helmet>
    <ErrorMessage />
  </div>
);
