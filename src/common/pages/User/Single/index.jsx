import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { Helmet } from 'react-helmet';

const GET_USER = gql`
  query getUser($id: ID!) {
    user(id: $id) {
      id
      name
      description
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

const Container = styled.div`
  padding: 0 400px;
`;

const SingleUser = ({ match }) => (
  <div>
    <Helmet>
      <title>User</title>
    </Helmet>
    <Query query={GET_USER} variables={match.params}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;
        const { user } = data;

        return (
          <Container name="dog">
            <Helmet>
              <title>{user.name}</title>
            </Helmet>
            <User key={user.id} value={user.name}>
              <div>{user.name}</div>
              {user.img &&
                user.img.imgUri && (
                  <img src={user.img.imgUri} alt={user.name} />
                )}
              <div>{user.description}</div>
            </User>
          </Container>
        );
      }}
    </Query>
  </div>
);

SingleUser.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired
};

export default SingleUser;
