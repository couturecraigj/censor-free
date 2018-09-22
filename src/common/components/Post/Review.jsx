import React from 'react';
import TextArea from '../TextArea';
import TextInput from '../TextInput';

const Review = () => (
  <div>
    <TextInput label="Subject" id="Review__subject" />
    <TextArea label="Body" id="Review__body" />
    <div>
      <button type="submit">Submit</button>
    </div>
  </div>
);

export default Review;
