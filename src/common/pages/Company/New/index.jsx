import React from 'react';
// import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { Formik, Form, Field } from 'formik';

const ADD_COMPANY = gql`
  mutation AddCompany($id: ID!) {
    addCompany(id: $id) {
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

const CompanyNew = () => (
  <div>
    <Helmet>
      <title>New Company</title>
    </Helmet>
    <Mutation mutation={ADD_COMPANY}>
      {addCompany => {
        return (
          <Container>
            <Company>
              <Formik onSubmit={variables => addCompany({ variables })}>
                {() => (
                  <Form>
                    <Field name="title">
                      {({ field }) => (
                        <div>
                          <div>
                            <label htmlFor="title">Title</label>
                          </div>
                          <input id="title" {...field} />
                        </div>
                      )}
                    </Field>
                    <Field name="description">
                      {({ field }) => (
                        <div>
                          <div>
                            <label htmlFor="description">Description</label>
                          </div>
                          <input id="description" {...field} />
                        </div>
                      )}
                    </Field>
                  </Form>
                )}
              </Formik>
            </Company>
          </Container>
        );
      }}
    </Mutation>
  </div>
);

CompanyNew.propTypes = {
  // match: PropTypes.shape({
  //   params: PropTypes.shape({
  //     id: PropTypes.string.isRequired
  //   })
  // }).isRequired
};

export default CompanyNew;
