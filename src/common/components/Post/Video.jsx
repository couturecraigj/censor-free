import React from 'react';
import FileInput from '../FileInput';
import TextInput from '../TextInput';
import TextArea from '../TextArea';

const Video = () => (
  <form>
    <FileInput label="Video" id="Video__file-input" />
    <TextInput name="title" label="Title" id="Video__title" />
    <TextArea name="description" label="Description" id="Video__description" />
    <div>
      <button type="submit">Submit</button>
    </div>
  </form>
);

export default Video;
