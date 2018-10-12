import React from 'react';
import PropTypes from 'prop-types';
import TextArea from '../TextArea';
import TextInput from '../TextInput';

const Question = ({ handleSubmit }) => (
  <form
    onSubmit={e => {
      e.preventDefault();
      handleSubmit(e);
    }}
  >
    <TextInput name="title" label="Subject" id="Question__subject" />
    <TextArea name="description" label="Body" id="Question__body" />
    <div>
      <button type="submit">Submit</button>
    </div>
  </form>
);

Question.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default Question;
