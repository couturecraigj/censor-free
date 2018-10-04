import React from 'react';
import { Helmet } from 'react-helmet';

const NotFound = () => {
  return (
    <div>
      <Helmet>
        <title>404 Not Found</title>
      </Helmet>
      <div>
        <h1>This is not the page you are looking for</h1>
      </div>
    </div>
  );
};

export default NotFound;
