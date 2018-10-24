import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import styled, { ThemeProvider, injectGlobal } from 'styled-components';
import { Provider } from 'react-redux';
import Post from './Post';
import Header from './Header';
import ErrorBoundary from './ErrorBoundary';
import Footer from './Footer';

injectGlobal`
  html {
    background: papayawhip;
    font-family: arial;
    height: 100%;
  }
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    position:relative;
    min-height: 100%;
  }
  .upload-button {
    /* background-color: #fff; */
    padding: 9px;
    cursor: pointer;
    border-radius: 2px;
    margin: 3px;
    text-align: center;
  }
`;

const Body = styled.div`
  padding: 10px;
  padding-bottom: 60px;
`;

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: false
    };
  }
  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }
  togglePost = close => {
    if (typeof close === 'boolean') {
      this.setState({
        post: !close
      });
    } else {
      const { post } = this.state;
      this.setState({
        post: !post
      });
    }
  };
  render() {
    const { children, store } = this.props;
    const { post } = this.state;

    return (
      <ThemeProvider theme={{ mode: 'light' }}>
        <Provider store={store}>
          <ErrorBoundary>
            <React.Fragment>
              <Header togglePost={this.togglePost} />
              <ErrorBoundary>
                <Body>{children}</Body>
              </ErrorBoundary>
              <Footer />
              {post && <Post close={this.togglePost} />}
            </React.Fragment>
          </ErrorBoundary>
        </Provider>
      </ThemeProvider>
    );
  }
}

Layout.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any.isRequired,
  location: PropTypes.shape({
    key: PropTypes.string
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  store: PropTypes.any.isRequired
};

export default withRouter(Layout);
