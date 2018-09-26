import React from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { Helmet } from 'react-helmet';

const GET_FEED = gql`
  {
    # PostUnion = Post | Review | Question | Answer | Image | Video | WebPage
    feed {
      id
      title
      description
      ... on Review {
        score
        products {
          id
          name
        }
      }
      ... on Question {
        answers {
          id
          title
          description
        }
      }
      ... on Photo {
        imgUri
        height
        width
      }
      ... on Video {
        img {
          imgUri
        }
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
                <div>
                  <strong>{post.__typename}</strong>
                </div>
                <div>{post.title}</div>
                {post.imgUri && <img src={post.imgUri} alt={post.title} />}
                {post.img &&
                  post.img.imgUri && (
                    <img src={post.img.imgUri} alt={post.title} />
                  )}
                <div>{post.description}</div>
              </Post>
            ))}
          </Feed>
        );
      }}
    </Query>
  </div>
);
