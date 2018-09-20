import React from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const SEARCH_SEARCHABLE = gql`
  {
    search {
      id
      ... on User {
        name
        description
        img {
          imgUri
        }
      }
      ... on Product {
        name
        description
        img {
          imgUri
        }
      }
      ... on Group {
        title
        description
        img {
          imgUri
        }
      }
      ... on Image {
        title
        description
        imgUri
      }
      ... on Video {
        title
        description
        img {
          imgUri
        }
      }
      ... on WebPage {
        title
        description
        img {
          imgUri
        }
      }
      ... on Company {
        name
        description
        img {
          imgUri
        }
      }
      ... on Tip {
        title
        description
      }
      ... on Review {
        title
        description
        score
      }
      ... on Thought {
        title
        description
      }
      ... on Question {
        title
        description
      }
      ... on Answer {
        title
        description
      }
      ... on Comment {
        description
      }
    }
  }
`;

const Searchable = styled.div`
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

const SearchableList = styled.div`
  padding: 0 400px;
`;

export default () => (
  <div>
    <Helmet>
      <title>Searchable List</title>
    </Helmet>
    <Query query={SEARCH_SEARCHABLE}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        return (
          <SearchableList name="dog">
            {data.search.map(search => (
              <Link key={search.id} to={`/search/${search.id}/${search.name}`}>
                <Searchable key={search.id} value={search.name}>
                  <div>{search.name}</div>
                  {(search.imgUri || search.img?.imgUri) && (
                    <img
                      src={search.imgUri || search.img.imgUri}
                      alt={search.name}
                    />
                  )}
                  <div>{search.description}</div>
                </Searchable>
              </Link>
            ))}
          </SearchableList>
        );
      }}
    </Query>
  </div>
);
