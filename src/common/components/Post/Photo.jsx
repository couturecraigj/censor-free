import React from 'react';
import { Mutation } from 'react-apollo';
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

const getVariableValues = eles => {
  return eles.reduce(
    (p, el) => ({
      ...p,
      [el.name]: el.type.toLowerCase() === 'number' ? +el.value : el.value
    }),
    {}
  );
};

const Photo = () => {
  let form;
  return (
    <Mutation mutation={SUBMIT_PHOTO}>
      {photo => {
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
                photo({ variables })
                  // eslint-disable-next-line no-console
                  .catch(console.error)
              );
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

export default Photo;
