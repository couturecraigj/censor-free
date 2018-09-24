import React from 'react';
import TextArea from '../TextArea';
import TextInput from '../TextInput';

const Story = () => (
  <form>
    <TextInput name="title" label="Subject" id="Story__subject" />
    <TextArea name="description" label="Body" id="Story__body" />
    <div>
      <button type="submit">Submit</button>
    </div>
  </form>
);

export default Story;
