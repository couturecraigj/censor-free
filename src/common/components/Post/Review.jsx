import React from 'react';
import TextArea from '../TextArea';
import TextInput from '../TextInput';
import ScoreInput from '../ScoreInput';

const Review = () => (
  <form>
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

export default Review;
