import React from 'react';
import { Helmet } from 'react-helmet';
import VideoUpload from '../../components/VideoUpload';

export default () => (
  <div>
    <Helmet>
      <title>Home</title>
    </Helmet>
    <VideoUpload
      name="video"
      accept="video/*"
      label="Video Upload"
      id="Home__video-upload"
    />
    <div>Home</div>
  </div>
);
