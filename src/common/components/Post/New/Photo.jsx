import React from 'react';
import { Mutation } from 'react-apollo';
import { Formik, Form } from 'formik';
// import { Form } from 'formik';
import gql from 'graphql-tag';
import { FormikFileUpload } from '../../FileUpload';
import { FormikTextArea } from '../../TextArea';
import { FormikTextInput } from '../../TextInput';
import FormDebugger from '../../FormDebug';

const initialValues = {
  title: '',
  description: '',
  imgUri: ''
};

const SUBMIT_PHOTO = gql`
  mutation AddPhoto(
    $imgUri: String!
    $description: String!
    $title: String!
    $width: Int!
    $height: Int!
  ) {
    addPhoto(
      imgUri: $imgUri
      description: $description
      title: $title
      width: $width
      height: $height
    ) {
      id
      imgUri
    }
  }
`;

const Photo = () => {
  return (
    <Mutation mutation={SUBMIT_PHOTO}>
      {photo => {
        return (
          <Formik
            onSubmit={variables => photo({ variables })}
            initialValues={initialValues}
          >
            <Form>
              <FormikFileUpload
                label="Photo"
                id="Photo__file-input"
                accept="image/*"
                name="imgUri"
              />
              <FormikTextInput
                name="title"
                label="Subject"
                id="Photo__subject"
              />
              <FormikTextArea
                name="description"
                label="Description"
                id="Photo_description"
              />
              <div>
                <button type="submit">Submit</button>
              </div>
              <FormDebugger />
            </Form>
          </Formik>
        );
      }}
    </Mutation>
  );
};

export default Photo;
