import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Post from './Post';

const Link = styled(NavLink).attrs({ activeClassName: 'current' })`
  font-size: 20px;
  line-height: 2rem;
  padding: 0 0.3rem;
  height: 2rem;
  &.current {
    color: red;
  }
`;

const Nav = styled.nav`
  display: flex;
  padding: 0 2rem;
  background: #ddd;
  paddingalign-items: center;
  justify-content: space-between;
`;

const Button = styled.button`
  text-decoration: none;
  background-color: #ddd;
  font-size: 20px;
  border-radius: 2rem;
  height: 2rem;
  width: 2rem;
  border: 1px dotted #999;
`;

const LinksDiv = styled.div`
  padding: 0 0.7rem;
  text-decoration: none;
  background-color: #ddd;
  font-size: 20px;
  height: 2rem;
  border-radius: 2rem;
  border: 1px dotted #999;
`;

const Account = styled.div`
  text-decoration: none;
  background-color: #ddd;
  font-size: 20px;
  border-radius: 2rem;
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
        <Nav>
          <LinksDiv>
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
          </LinksDiv>
          <Account>
            <span>SignIn</span>
            <Button type="submit" onClick={this.togglePost}>
              +
            </Button>
          </Account>
        </Nav>
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
