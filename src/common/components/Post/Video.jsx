import React from 'react';
import FileInput from '../FileInput';
import TextInput from '../TextInput';

const Video = () => (
  <div>
    <div>
      <FileInput label="Video" id="Video__file-input" />
    </div>
    <div>
      <TextInput label="Title" id="Video__title" />
    </div>
    <div>
      <button type="submit">Submit</button>
    </div>
  </div>
);

export default Video;
