import React from 'react';
import { Helmet } from 'react-helmet';
import VideoPlayer from '../../components/VideoPlayer';

// http://localhost:3000/5bb3b25e69b02ed5724ab2ac/aead77ff-8828-47e5-a92c-308d6a987fa2/24281f17-b595-49b6-b2ad-c72783a883f3/playlist.m3u8
export default () => (
  <div>
    <Helmet>
      <title>Home</title>
    </Helmet>
    <div>
      <VideoPlayer
        src="http://localhost:3000/5bb3b25e69b02ed5724ab2ac/8fbd2a3a-e8c7-4d97-be09-b9054a1ad1ff/7c2e062b-883e-4eda-8515-801f8d24059d"
        poster="http://localhost:3000/5bb3b25e69b02ed5724ab2ac/8fbd2a3a-e8c7-4d97-be09-b9054a1ad1ff/7c2e062b-883e-4eda-8515-801f8d24059d/1.png"
        width="640"
        controls
      />
      Home
    </div>
  </div>
);
