import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const ErrorMessage = ({ errorMessage }) => (
  <div>
    <Helmet>
      <title>Error</title>
    </Helmet>
    <h1>Oops it appears there was an error</h1>
    <p>{errorMessage}</p>
  </div>
);
ErrorMessage.propTypes = {
  errorMessage: PropTypes.string.isRequired
};
export default ErrorMessage;
