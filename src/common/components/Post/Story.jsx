import React from 'react';
import PropTypes from 'prop-types';
import TextArea from '../TextArea';
import TextInput from '../TextInput';

const Story = ({ handleSubmit }) => (
  <form
    onSubmit={e => {
      e.preventDefault();
      handleSubmit(e);
    }}
  >
    <TextInput name="title" label="Subject" id="Story__subject" />
    <TextArea name="description" label="Body" id="Story__body" />
    <div>
      <button type="submit">Submit</button>
    </div>
  </form>
);

Story.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default Story;
