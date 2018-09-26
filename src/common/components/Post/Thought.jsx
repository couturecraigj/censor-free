import React from 'react';
import TextArea from '../TextArea';

const Thought = () => (
  <form>
    <TextArea
      name="description"
      label="Tell me something..."
      id="Thought__TextArea"
    />
    <div>
      <button type="submit">Submit</button>
    </div>
  </form>
);

export default Thought;
