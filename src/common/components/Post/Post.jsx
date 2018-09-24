import React from 'react';
import TextArea from '../TextArea';

const Post = () => (
  <form>
    <TextArea
      name="description"
      label="Tell me something..."
      id="Post__TextArea"
    />
    <div>
      <button type="submit">Submit</button>
    </div>
  </form>
);

export default Post;
