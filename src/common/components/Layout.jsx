import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Post from './Post';

const Link = styled(NavLink).attrs({ activeClassName: 'current' })`
  &.current {
    color: red;
  }
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
        <div>
          <Link to="/" exact>
            Home
          </Link>
          <Link to="/about">About</Link>
          <Link to="/company/list">Company</Link>
          <Link to="/feed">Feed</Link>
          <Link to="/group/list">Group</Link>
          <Link to="/product/list">Product</Link>
          <Link to="/saved">Saved</Link>
          <Link to="/search">Search</Link>
          <Link to="/user/list">User</Link>
          <Link to="/video/list">Videos</Link>
          <button type="submit" onClick={this.togglePost}>
            Post
          </button>
        </div>
        <div>{children}</div>
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
