import React from 'react';
import TextArea from '../TextArea';
import TextInput from '../TextInput';

const Story = () => (
  <div>
    <TextInput label="Subject" id="Story__subject" />
    <TextArea label="Body" id="Story__body" />
    <div>
      <button type="submit">Submit</button>
    </div>
  </div>
);

export default Story;
