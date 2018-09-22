import React from 'react';
import TextArea from '../TextArea';
import TextInput from '../TextInput';

const Question = () => (
  <div>
    <TextInput label="Subject" id="Question__subject" />
    <TextArea label="Body" id="Question__body" />
    <div>
      <button type="submit">Submit</button>
    </div>
  </div>
);

export default Question;
