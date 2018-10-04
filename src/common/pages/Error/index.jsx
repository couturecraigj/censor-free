import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import ErrorMessage from '../../components/ErrorMessage';

const mapStateToProps = ({ errorMessage }, ownProps) => {
  return {
    ...ownProps,
    errorMessage
  };
};

const ErrorPage = ({ errorMessage }) => {
  return (
    <div>
      <Helmet>
        <title>Error</title>
      </Helmet>
      <ErrorMessage errorMessage={errorMessage} />
    </div>
  );
};

ErrorPage.propTypes = {
  errorMessage: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(ErrorPage);
