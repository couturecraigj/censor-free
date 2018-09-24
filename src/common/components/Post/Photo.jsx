import React from 'react';
import FileInput from '../FileInput';
import TextArea from '../TextArea';

const Photo = () => (
  <form>
    <FileInput label="Photo" id="Photo__file-input" />
    <TextArea name="description" label="Description" id="Photo_description" />
    <div>
      <button type="submit">Submit</button>
    </div>
  </form>
);

export default Photo;
