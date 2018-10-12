import React from 'react';
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

const getVariableValues = elements => {
  return elements.reduce(
    (p, el) => ({
      ...p,
      [el.name]: el.type.toLowerCase() === 'number' ? +el.value : el.value
    }),
    {}
  );
};

const Video = () => {
  let form;
  return (
    <Mutation mutation={SUBMIT_VIDEO}>
      {video => {
        return (
          <form
            ref={ref => {
              form = ref;
            }}
            onSubmit={e => {
              e.preventDefault();
              const elements = [...form.elements].filter(
                el => el.tagName !== 'BUTTON'
              );
              const variables = getVariableValues(elements);
              return (
                video({ variables })
                  // eslint-disable-next-line no-console
                  .catch(console.error)
              );
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

export default Video;
