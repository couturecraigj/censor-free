import React from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Helmet } from 'react-helmet';

const GET_SAVED = gql`
  {
    saved {
      id
      object {
        ... on Product {
          id
          name
          description
        }
        ... on Video {
          id
          title
          description
        }
        ... on Company {
          id
          name
          description
        }
        ... on WebPage {
          id
          title
          description
        }
      }
      img {
        imgUri
      }
    }
  }
`;

const Masonry = styled.div`
  transition: all 0.5s ease-in-out;
  margin: 1rem 0;
  column-gap: 30px;
  column-fill: initial;
  @media only screen and (max-width: 767px) and (min-width: 540px) {
    column-count: 2;
  }
  @media only screen and (max-width: 1023px) and (min-width: 768px) {
    column-count: 3;
  }
  @media only screen and (max-width: 1399px) and (min-width: 1024px) {
    column-count: 4;
  }
  @media only screen and (max-width: 1600px) and (min-width: 1400px) {
    column-count: 5;
  }
  @media only screen and (min-width: 1601px) {
    column-count: 6;
  }
`;

const Img = styled.img`
  width: calc(100% - 1rem);
`;
const Title = styled.h3`
  width: calc(100% - 1rem);
  text-align: center;
  margin: 0 0 0.5rem 0;
`;
const Description = styled.div`
  width: calc(100% - 1rem);
  margin: 0.5rem 0;
`;
const Brick = styled.div`
  transition: all 0.5s ease-in-out;
  color: #444;
  background-color: #eee;
  border-radius: 0.5rem;
  padding: 1rem;
  display: inline-block;
  margin: 0 0 1em;
  width: 100%;
  height: auto;
`;

export default () => (
  <div>
    <Helmet>
      <title>Saved</title>
    </Helmet>
    <Query query={GET_SAVED}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';

        if (error) return `Error! ${error.message}`;

        return (
          <Masonry>
            <React.Fragment>
              {data.saved.map(post => (
                <Brick key={post.id}>
                  <Title>
                    {post.object.title}
                    {post.object.name}
                  </Title>
                  <Img src={post.img.imgUri} alt={post.object.title} />
                  <Description>{post.object.description}</Description>
                </Brick>
              ))}
            </React.Fragment>
          </Masonry>
        );
      }}
    </Query>
  </div>
);
