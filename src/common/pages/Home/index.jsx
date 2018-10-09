import React from 'react';
import { Helmet } from 'react-helmet';
import FileUpload from '../../components/FileUpload';

export default () => (
  <div>
    <Helmet>
      <title>Home</title>
    </Helmet>
    <FileUpload
      name="video"
      accept="video/*"
      label="Video Upload"
      id="Home__video-upload"
    />
    <div>Home</div>
  </div>
);
