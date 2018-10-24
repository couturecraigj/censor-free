import React from 'react';
// import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { Formik, Form, Field } from 'formik';
/**
 * TODO: Make it so that users can create Products
 */
const ADD_PRODUCT = gql`
  mutation AddProduct($id: ID!) {
    addProduct(id: $id) {
      id
      name
      description
      img {
        imgUri
      }
    }
  }
`;

const Product = styled.div`
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

const ProductNew = () => (
  <div>
    <Helmet>
      <title>New Product</title>
    </Helmet>
    <Mutation mutation={ADD_PRODUCT}>
      {addProduct => {
        return (
          <Container>
            <Product>
              <Formik onSubmit={variables => addProduct({ variables })}>
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
            </Product>
          </Container>
        );
      }}
    </Mutation>
  </div>
);

ProductNew.propTypes = {
  // match: PropTypes.shape({
  //   params: PropTypes.shape({
  //     id: PropTypes.string.isRequired
  //   })
  // }).isRequired
};

export default ProductNew;
