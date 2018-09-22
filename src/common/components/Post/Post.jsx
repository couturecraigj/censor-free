import React from 'react';
import TextArea from '../TextArea';

const Post = () => (
  <div>
    <TextArea label="Tell me something" id="Post__TextArea" />
    <div>
      <button type="submit">Submit</button>
    </div>
  </div>
);

export default Post;
