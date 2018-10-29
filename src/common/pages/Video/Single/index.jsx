import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { Helmet } from 'react-helmet';

const GET_VIDEO = gql`
  query getVideo($id: ID!) {
    video(id: $id) {
      id
      title
      description
      img {
        imgUri
      }
    }
  }
`;

const Video = styled.div`
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

const SingleVideo = ({ match }) => (
  <div>
    <Helmet>
      <title>Video</title>
    </Helmet>
    <Query query={GET_VIDEO} variables={match.params}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';

        if (error) return `Error! ${error.message}`;

        const { video } = data;

        return (
          <Container name="dog">
            <Helmet>
              <title>{video.title}</title>
            </Helmet>
            <Video key={video.id} value={video.title}>
              <div>{video.title}</div>
              {video.img &&
                video.img.imgUri && (
                  <img src={video.img.imgUri} alt={video.title} />
                )}
              <div>{video.description}</div>
            </Video>
          </Container>
        );
      }}
    </Query>
  </div>
);

SingleVideo.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired
};

export default SingleVideo;
