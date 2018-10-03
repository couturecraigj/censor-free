import React from 'react';
import PropTypes from 'prop-types';

const ErrorMessage = ({ errorMessage }) => (
  <div>
    <h1>Oops it appears there was an error</h1>
    <p>{errorMessage}</p>
  </div>
);
ErrorMessage.propTypes = {
  errorMessage: PropTypes.string.isRequired
};
export default ErrorMessage;
