import React from 'react';
import PropTypes from 'prop-types';
import TextArea from '../TextArea';
import TextInput from '../TextInput';
import ScoreInput from '../ScoreInput';

const Review = ({ handleSubmit }) => (
  <form
    onSubmit={e => {
      e.preventDefault();
      handleSubmit(e);
    }}
  >
    <ScoreInput
      name="score"
      label="Score"
      min={0}
      max={10}
      step={0.5}
      id="Review__score"
    />
    <TextInput name="title" label="Subject" id="Review__subject" />
    <TextArea name="description" label="Body" id="Review__body" />
    <div>
      <button type="submit">Submit</button>
    </div>
  </form>
);

Review.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default Review;
