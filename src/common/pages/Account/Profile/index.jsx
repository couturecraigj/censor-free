import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import { Helmet } from 'react-helmet';

const GET_GROUP = gql`
  query getGroup($id: ID!) {
    group(id: $id) {
      id
      title
      description
      img {
        imgUri
      }
    }
  }
`;

const Group = styled.div`
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

const Profile = ({ match: { params }, loggedIn }) => (
  <div>
    <Helmet>
      <title>Group</title>
    </Helmet>
    {!loggedIn && <Redirect to="/" />}
    <Query query={GET_GROUP} variables={params}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';

        if (error) return `Error! ${error.message}`;

        const { group } = data;

        return (
          <Container name="dog">
            <Helmet>
              <title>{group.title}</title>
            </Helmet>
            <Group key={group.id} value={group.title}>
              <div>{group.title}</div>
              {group.img && group.img.imgUri && (
                <img src={group.img.imgUri} alt={group.title} />
              )}
              <div>{group.description}</div>
            </Group>
          </Container>
        );
      }}
    </Query>
  </div>
);

Profile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired,
  loggedIn: PropTypes.bool.isRequired
};

export default connect(({ loggedIn }) => ({ loggedIn }))(Profile);
