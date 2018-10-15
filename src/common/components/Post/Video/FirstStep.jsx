import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { Formik, Form } from 'formik';
import gql from 'graphql-tag';
import { FormikFileUpload } from '../../FileUpload';
import { FormikTextInput } from '../../TextInput';
import { FormikTextArea } from '../../TextArea';
import FormDebug from '../../FormDebug';

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

const VideoFirstStep = ({ nextStep }) => (
  <Mutation mutation={SUBMIT_VIDEO}>
    {video => {
      return (
        <Formik
          initialValues={{
            title: '',
            description: ''
            // videoId: ''
          }}
          onSubmit={variables => {
            video({ variables }).then(({ data }) => nextStep(data));
          }}
        >
          {() => (
            <Form>
              <FormikFileUpload
                label="Video"
                accept="video/*"
                name="videoUri"
                id="Video__file-input"
              />
              <FormikTextInput name="title" label="Title" id="Video__title" />
              <FormikTextArea
                name="description"
                label="Description"
                id="Video__description"
              />
              <div>
                <button type="submit">Submit</button>
              </div>
              <FormDebug />
            </Form>
          )}
        </Formik>
      );
    }}
  </Mutation>
);

VideoFirstStep.propTypes = {
  nextStep: PropTypes.func.isRequired
};

export default VideoFirstStep;
