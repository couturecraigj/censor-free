import React from 'react';
import FileInput from '../FileInput';

const Photo = () => (
  <div>
    <FileInput label="Photo" id="Photo__file-input" />
    <div>
      <button type="submit">Submit</button>
    </div>
  </div>
);

export default Photo;
