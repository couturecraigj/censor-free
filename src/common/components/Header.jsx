import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { withApollo } from 'react-apollo';
import * as Routes from '../pages/Routes';

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
  align-items: center;
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

const Logout = styled.button`
  text-decoration: none;
  background-color: #ddd;
  font-size: 20px;
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

const Layout = ({ togglePost, client }) => (
  <Nav>
    <LinksDiv>
      <Link
        to="/"
        exact
        onMouseOver={Routes.Home.load}
        onFocus={Routes.Home.load}
      >
        Home
      </Link>
      <Link
        to="/about"
        onMouseOver={Routes.About.load}
        onFocus={Routes.About.load}
      >
        About
      </Link>
      <Link
        to="/company/list"
        onMouseOver={Routes.CompanyList.load}
        onFocus={Routes.CompanyList.load}
      >
        Company
      </Link>
      <Link
        to="/feed"
        onMouseOver={Routes.Feed.load}
        onFocus={Routes.Feed.load}
      >
        Feed
      </Link>
      <Link
        to="/group/list"
        onMouseOver={Routes.GroupList.load}
        onFocus={Routes.GroupList.load}
      >
        Group
      </Link>
      <Link
        to="/product/list"
        onMouseOver={Routes.ProductList.load}
        onFocus={Routes.ProductList.load}
      >
        Product
      </Link>
      <Link
        to="/saved"
        onMouseOver={Routes.Saved.load}
        onFocus={Routes.Saved.load}
      >
        Saved
      </Link>
      <Link
        to="/search"
        onMouseOver={Routes.Search.load}
        onFocus={Routes.Search.load}
      >
        Search
      </Link>
      <Link
        to="/user/list"
        onMouseOver={Routes.UserList.load}
        onFocus={Routes.UserList.load}
      >
        User
      </Link>
      <Link
        to="/video/list"
        onMouseOver={Routes.VideoList.load}
        onFocus={Routes.VideoList.load}
      >
        Videos
      </Link>
    </LinksDiv>
    <Account>
      <Logout
        onClick={e => {
          e.preventDefault();
          localStorage.removeItem('token');
          client.resetStore();
        }}
      >
        Logout
      </Logout>
      <Link
        to="/login"
        onMouseOver={Routes.Login.load}
        onFocus={Routes.Login.load}
      >
        Login
      </Link>
      <Button type="submit" onClick={togglePost}>
        +
      </Button>
    </Account>
  </Nav>
);

Layout.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  togglePost: PropTypes.func.isRequired,
  client: PropTypes.shape({
    resetStore: PropTypes.func.isRequired
  }).isRequired
};

export default withApollo(Layout);
