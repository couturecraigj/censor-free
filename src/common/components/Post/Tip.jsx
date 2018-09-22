import React from 'react';
import TextArea from '../TextArea';
import TextInput from '../TextInput';

const Tip = () => (
  <div>
    <TextInput label="Subject" id="Tip__subject" />
    <TextArea label="Body" id="Tip__body" />
    <div>
      <button type="submit">Submit</button>
    </div>
  </div>
);

export default Tip;
