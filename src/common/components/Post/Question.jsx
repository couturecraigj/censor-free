import React from 'react';
import TextArea from '../TextArea';
import TextInput from '../TextInput';

const Question = () => (
  <form>
    <TextInput name="title" label="Subject" id="Question__subject" />
    <TextArea name="description" label="Body" id="Question__body" />
    <div>
      <button type="submit">Submit</button>
    </div>
  </form>
);

export default Question;
