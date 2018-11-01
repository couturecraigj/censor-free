import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';
import { COOKIE_TYPE_MAP } from '../types';
import * as Routes from '../pages/Routes';

const ME = gql`
  query Me {
    me {
      id
    }
  }
`;

const LOG_OUT = gql`
  mutation LogOut {
    logOut
  }
`;

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

const LogoutButton = connect()(({ dispatch, client }) => (
  <Logout
    onClick={e => {
      e.preventDefault();
      window.localForage.removeItem(COOKIE_TYPE_MAP.token);

      return (
        client
          .mutate({ mutation: LOG_OUT })
          // eslint-disable-next-line no-console
          .then(result => console.log(result))
          .then(client.resetStore)
          .then(
            dispatch({
              type: '@LOGOUT'
            })
          )
          // eslint-disable-next-line no-console
          .catch(err => console.error(err))
      );
    }}
  >
    Logout
  </Logout>
));

const Layout = ({ togglePost }) => (
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
      <Query query={ME}>
        {({ data: { me }, client }) => (
          <React.Fragment>
            {me && <LogoutButton client={client} />}
            {!me && (
              <Link
                to="/login"
                onMouseOver={Routes.Login.load}
                onFocus={Routes.Login.load}
              >
                Login
              </Link>
            )}
            {me && (
              <Button type="submit" onClick={togglePost}>
                +
              </Button>
            )}
          </React.Fragment>
        )}
      </Query>
    </Account>
  </Nav>
);

Layout.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  togglePost: PropTypes.func.isRequired
};

export default Layout;
