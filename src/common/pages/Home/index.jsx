import React from 'react';
import { Helmet } from 'react-helmet';
import VideoPlayer from '../../components/VideoPlayer';

// TODO: Make it so main pages gives a good overview

export default () => (
  <div>
    <Helmet>
      <title>Home</title>
    </Helmet>
    <div>
      Home
      <div>
        <VideoPlayer
          src="http://localhost:3000/5bb3b25e69b02ed5724ab2ac/d25058cc-378f-4a4c-97ac-c9a61c3e1a36/520b8a6c-1f64-40d7-965a-35d2456f8bc6"
          poster="http://localhost:3000/5bb3b25e69b02ed5724ab2ac/d25058cc-378f-4a4c-97ac-c9a61c3e1a36/520b8a6c-1f64-40d7-965a-35d2456f8bc6/1.png"
          width="640"
          controls
          // editing
        />
      </div>
    </div>
  </div>
);
