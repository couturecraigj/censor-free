import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import ErrorMessage from '../../components/ErrorMessage';

const ErrorPage = ({ staticContext }) => {
  return (
    <div>
      <Helmet>
        <title>Error</title>
      </Helmet>
      <ErrorMessage {...staticContext} />
    </div>
  );
};

ErrorPage.propTypes = {
  staticContext: PropTypes.shape({
    errorMessage: PropTypes.string
  })
};

ErrorPage.defaultProps = {
  staticContext: {
    errorMessage:
      typeof window !== 'undefined' ? window.__ERROR_MESSAGE__ : 'error'
  }
};

export default ErrorPage;
