import React from 'react';
import PropTypes from 'prop-types';
import ErrorMessage from './ErrorMessage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error);
    // eslint-disable-next-line no-console
    console.info(info);
    // logErrorToMyService(error, info);
  }
  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      // You can render any custom fallback UI
      return <ErrorMessage />;
    }
    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.element.isRequired
};

export default ErrorBoundary;
