import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import queryString from 'query-string';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Formik, Form } from 'formik';
import { FormikTextInput } from '../../components/TextInput';
// TODO: Make it so this actually searches

const SEARCH_SEARCHABLE = gql`
  query Search($search: String) {
    search(text: $search) {
      id
      ... on User {
        userName
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
      ... on Photo {
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

export default class extends React.Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
      pathname: PropTypes.string
    }).isRequired
  };
  static getDerivedStateFromProps(props, state) {
    if (props.location.search) {
      const { s: search } = queryString.parse(props.location.search);
      if (search === state.search) return;
      return { search };
    }
    return null;
  }
  state = {};
  onSubmit = values => {
    const { history, location } = this.props;
    if (!values.search) return history.push(location.pathname);
    const search = `?s=${values.search}`.trim();
    if (search === location.search.trim()) return;
    history.push(`${location.pathname}${search}`);
    this.setState(values);
  };
  onChange = e => {
    if (!e.target.value) {
      this.onSubmit({});
    }
  };
  render() {
    return (
      <div>
        <Helmet>
          <title>Searchable List</title>
        </Helmet>
        <Formik onSubmit={this.onSubmit}>
          {() => (
            <Form>
              <SearchableList>
                <Searchable>
                  <FormikTextInput
                    id="search"
                    name="search"
                    label="Search..."
                    onChange={this.onChange}
                  />
                </Searchable>
              </SearchableList>

              <Query query={SEARCH_SEARCHABLE} variables={this.state}>
                {({ loading, error, data }) => {
                  if (loading)
                    return (
                      <SearchableList>
                        <Searchable>Loading...</Searchable>
                      </SearchableList>
                    );
                  if (error) return `Error! ${error.message}`;

                  return (
                    <SearchableList name="dog">
                      {data.search.map(search => (
                        <Link
                          key={search.id}
                          to={`/search/${search.id}/${search.name}`}
                        >
                          <Searchable key={search.id} value={search.name}>
                            <div>{search.name || search.userName}</div>
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
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}
