import React from 'react';
import TextArea from '../TextArea';
import TextInput from '../TextInput';

const Tip = () => (
  <form>
    <TextInput name="title" label="Subject" id="Tip__subject" />
    <TextArea name="description" label="Body" id="Tip__body" />
    <div>
      <button type="submit">Submit</button>
    </div>
  </form>
);

export default Tip;
