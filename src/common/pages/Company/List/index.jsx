import React from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const GET_COMPANYLIST = gql`
  {
    companies {
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

const CompanyList = styled.div`
  padding: 0 400px;
`;

export default () => (
  <div>
    <Helmet>
      <title>Company List</title>
    </Helmet>
    <Query query={GET_COMPANYLIST}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        return (
          <CompanyList name="dog">
            {data.companies.map(company => (
              <Link
                key={company.id}
                to={`/company/${company.id}/${company.name}`}
              >
                <Company key={company.id} value={company.name}>
                  <div>{company.name}</div>
                  {company.img &&
                    company.img.imgUri && (
                      <img src={company.img.imgUri} alt={company.name} />
                    )}
                  <div>{company.description}</div>
                </Company>
              </Link>
            ))}
          </CompanyList>
        );
      }}
    </Query>
  </div>
);
