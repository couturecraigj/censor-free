import React from 'react';
// import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import * as Yup from 'yup';
import { Mutation } from 'react-apollo';
import { Helmet } from 'react-helmet';
import { Formik, Form } from 'formik';
import { FormikFileUpload } from '../../../components/FileUpload';
import { FormikTextInput } from '../../../components/TextInput';
import { FormikTextArea } from '../../../components/TextArea';
import DebugField from '../../../components/FormDebug';
/**
 * TODO: Make it so that users can create Products
 */
const ADD_PRODUCT = gql`
  mutation AddProduct($name: String!, $description: String, $imgUri: String!) {
    addProduct(name: $name, description: $description, imgUri: $imgUri) {
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

const validationSchema = Yup.object().shape({
  name: Yup.string().required('You must give it a name'),
  description: Yup.string().required(
    'You need to provide at least a little description'
  ),
  imgUri: Yup.string().required(
    'You need to have an image uploaded before continuing'
  )
});

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
              <Formik
                validationSchema={validationSchema}
                onSubmit={variables =>
                  addProduct({ variables }).then(
                    ({ data }) =>
                      (location.href = `/product/${data.addProduct.id}/${
                        data.addProduct.name
                      }`)
                  )
                }
              >
                {() => (
                  <Form>
                    <FormikFileUpload
                      name="imgUri"
                      label="Product Image Upload"
                      accept="image/*"
                      id="imgUri"
                    />
                    <FormikTextInput name="name" id="name" label="Name" />
                    <FormikTextArea
                      name="description"
                      id="description"
                      label="Description"
                    />
                    <button type="submit">Submit</button>
                    <DebugField />
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
