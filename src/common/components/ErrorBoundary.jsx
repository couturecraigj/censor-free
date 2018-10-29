import React from 'react';
import PropTypes from 'prop-types';
import ErrorMessage from './ErrorMessage';

const __DEV__ = process.env.NODE_ENV !== 'production';

class ErrorBoundary extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }
  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true }, () => {
      // You can also log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(error);
      // eslint-disable-next-line no-console
      console.info(info);

      // logErrorToMyService(error, info);
      if (__DEV__)
        this.setState({
          errorMessage: __DEV__
            ? `${error.toString()}
            ${error.message}
            ${error.stack}
            ${info.componentStack}`
            : 'There seems to have been an error'
        });
    });
  }
  render() {
    const { hasError, errorMessage } = this.state;
    const { children, height, width } = this.props;

    if (hasError) {
      // You can render any custom fallback UI
      return (
        <ErrorMessage {...{ height, width }} errorMessage={errorMessage} />
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.element.isRequired,
  height: PropTypes.number,
  width: PropTypes.number
};

ErrorBoundary.defaultProps = {
  height: undefined,
  width: undefined
};

export default ErrorBoundary;
