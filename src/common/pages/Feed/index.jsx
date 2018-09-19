import React from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { Helmet } from 'react-helmet';

const GET_FEED = gql`
  {
    # PostUnion = Post | Review | Question | Answer | Image | Video | WebPage
    feed {
      ... on Post {
        id
        title
        description
      }
      ... on Review {
        id
        title
        description
      }
      ... on Question {
        id
        title
        description
      }
      ... on Answer {
        id
        title
        description
      }
      ... on Image {
        id
        title
        description
      }
      ... on Video {
        id
        title
        description
      }
      ... on WebPage {
        id
        title
        description
      }
    }
  }
`;

const Post = styled.div`
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

const Feed = styled.div`
  padding: 0 400px;
`;

export default () => (
  <div>
    <Helmet>
      <title>Feed</title>
    </Helmet>
    <Query query={GET_FEED}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        return (
          <Feed name="dog">
            {data.feed.map(post => (
              <Post key={post.id} value={post.title}>
                <div>{post.title}</div>
                <img
                  src="https://picsum.photos/500/300/?random"
                  alt={post.title}
                />
                <div>{post.description}</div>
              </Post>
            ))}
          </Feed>
        );
      }}
    </Query>
  </div>
);
