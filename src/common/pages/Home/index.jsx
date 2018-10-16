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
        src="http://localhost:3000/5bb3b25e69b02ed5724ab2ac/4cb4de65-4bfe-47b7-a6cd-b46d65d98c62/37c5f878-647e-4aad-accf-1ee12bf45809"
        poster="http://localhost:3000/5bb3b25e69b02ed5724ab2ac/4cb4de65-4bfe-47b7-a6cd-b46d65d98c62/37c5f878-647e-4aad-accf-1ee12bf45809/1.png"
        width="640"
        controls
      />
      Home
    </div>
  </div>
);
