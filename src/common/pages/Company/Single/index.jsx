import React from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { Helmet } from 'react-helmet';

const GET_COMPANY = gql`
  {
    company {
      id
      name
      description
      img {
        imgUri
      }
    }
  }
`;

const Company = styled.div`
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

export default () => (
  <div>
    <Helmet>
      <title>Company</title>
    </Helmet>
    <Query query={GET_COMPANY}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;
        const { company } = data;

        return (
          <Container name="dog">
            <Company key={company.id} value={company.name}>
              <div>{company.name}</div>
              {company.img &&
                company.img.imgUri && (
                  <img src={company.img.imgUri} alt={company.name} />
                )}
              <div>{company.description}</div>
            </Company>
          </Container>
        );
      }}
    </Query>
  </div>
);
