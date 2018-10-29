import React from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { User as UserRoute } from '../../Routes';

const GET_USER_LIST = gql`
  {
    users {
      id
      userName
      img {
        imgUri
      }
    }
  }
`;

const User = styled.div`
  width: 100%;
  background: white;
  padding: 8px;
  border-radius: 2px;
  margin: 10px;
  & img {
    width: 100%;
    height: auto;
  }
`;

const UserList = styled.div`
  padding: 0 400px;
`;

export default () => (
  <div>
    <Helmet>
      <title>User List</title>
    </Helmet>
    <Query query={GET_USER_LIST}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';

        if (error) return `Error! ${error.message}`;

        return (
          <UserList name="userList">
            {data.users.map(user => (
              <Link
                key={user.id}
                onMouseOver={UserRoute.load}
                onFocus={UserRoute.load}
                to={`/user/${user.id}/${user.userName}`}
              >
                <User key={user.id} value={user.userName}>
                  <div>{user.userName}</div>
                  {user.img &&
                    user.img.imgUri && (
                      <img src={user.img.imgUri} alt={user.userName} />
                    )}
                  <div>{user.description}</div>
                </User>
              </Link>
            ))}
          </UserList>
        );
      }}
    </Query>
  </div>
);
