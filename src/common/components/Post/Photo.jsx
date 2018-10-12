import React from 'react';
import { Mutation } from 'react-apollo';
import { Formik, Form } from 'formik';
// import { Form } from 'formik';
import gql from 'graphql-tag';
import FileUpload from '../FileUpload';
import TextArea from '../TextArea';
import TextInput from '../TextInput';
import FormDebugger from '../FormDebug';

const initialValues = {
  title: '',
  description: '',
  imgUri: '',
  height: '',
  weight: ''
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
              <FileUpload
                label="Photo"
                id="Photo__file-input"
                accept="image/*"
                name="imgUri"
              />
              <TextInput name="title" label="Subject" id="Photo__subject" />
              <TextArea
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
