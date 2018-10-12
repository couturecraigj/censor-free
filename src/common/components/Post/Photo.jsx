import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
// import { Form } from 'formik';
import gql from 'graphql-tag';
import FileInput from '../FileInput';
import TextArea from '../TextArea';
import TextInput from '../TextInput';

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

const Photo = ({ handleSubmit }) => {
  return (
    <Mutation mutation={SUBMIT_PHOTO}>
      {photo => {
        return (
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSubmit(photo);
            }}
          >
            <FileInput
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
          </form>
        );
      }}
    </Mutation>
  );
};

Photo.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default Photo;
