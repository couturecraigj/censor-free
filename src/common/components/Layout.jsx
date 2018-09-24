import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Post from './Post';
import Header from './Header';
import Footer from './Footer';

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
    const { children } = this.props;
    const { post } = this.state;

    return (
      <React.Fragment>
        <Header togglePost={this.togglePost} />
        <Body>{children}</Body>
        <Footer />
        {post && <Post close={this.togglePost} />}
      </React.Fragment>
    );
  }
}

Layout.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any.isRequired
};

export default Layout;
