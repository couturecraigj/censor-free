import React from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Video as VideoRoute } from '../../Routes';

const GET_VIDEO_LIST = gql`
  {
    videos {
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

const VideoList = styled.div`
  padding: 0 400px;
`;

export default () => (
  <div>
    <Helmet>
      <title>Video List</title>
    </Helmet>
    <Query query={GET_VIDEO_LIST}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        return (
          <VideoList name="dog">
            {data.videos.map(video => (
              <Link
                key={video.id}
                to={`/video/${video.id}/${video.title}`}
                onMouseOver={VideoRoute.load}
                onFocus={VideoRoute.load}
              >
                <Video key={video.id} value={video.title}>
                  <div>{video.title}</div>
                  {video.img &&
                    video.img.imgUri && (
                      <img src={video.img.imgUri} alt={video.title} />
                    )}
                  <div>{video.description}</div>
                </Video>
              </Link>
            ))}
          </VideoList>
        );
      }}
    </Query>
  </div>
);
