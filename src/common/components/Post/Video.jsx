import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import FileInput from '../FileInput';
import TextInput from '../TextInput';
import TextArea from '../TextArea';

const SUBMIT_VIDEO = gql`
  mutation AddVideo(
    $videoUri: String!
    $description: String!
    $title: String!
  ) {
    addVideo(videoUri: $videoUri, description: $description, title: $title) {
      id
      uri
    }
  }
`;

const Video = ({ handleSubmit }) => {
  let form;
  return (
    <Mutation mutation={SUBMIT_VIDEO}>
      {video => {
        return (
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSubmit(video);
            }}
          >
            <FileInput
              label="Video"
              accept="video/*"
              name="videoUri"
              id="Video__file-input"
            />
            <TextInput name="title" label="Title" id="Video__title" />
            <TextArea
              name="description"
              label="Description"
              id="Video__description"
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

Video.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default Video;
