import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const ErrorMessage = ({ errorMessage, height, width }) => (
  <div>
    <Helmet>
      <title>Error</title>
    </Helmet>
    <div style={{ height: height ? height - 40 : undefined, width }}>
      <div style={{ fontSize: 28, height: 24, padding: 4 }}>
        Oops it appears there was an error
      </div>
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>
        <pre
          style={{
            position: 'absolute',
            padding: 4,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            wordWrap: 'normal',
            whiteSpace: 'pre-wrap',
            overflow: 'scroll'
          }}
        >
          {errorMessage}
        </pre>
      </div>
    </div>
  </div>
);

ErrorMessage.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  height: PropTypes.number,
  width: PropTypes.number
};

ErrorMessage.defaultProps = {
  height: undefined,
  width: undefined
};
export default ErrorMessage;
