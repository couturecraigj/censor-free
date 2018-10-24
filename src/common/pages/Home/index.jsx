import React from 'react';
import { Helmet } from 'react-helmet';
import VideoPlayer from '../../components/VideoPlayer';

const url = 'public/5bb3b25e69b02ed5724ab2ac/89b705ad-3b00-4b1c-93d6-fc2b5c60ad84/bd48e4ec-6b87-4507-8af6-aca633d88021'.replace(
  'public/',
  ''
);

// TODO: Make it so main pages gives a good overview

export default () => {
  return (
    <div>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div>
        Home
        <div>
          <React.Fragment>
            <VideoPlayer
              src={`http://localhost:3000/${url}`}
              poster={`http://localhost:3000/${url}/1.png`}
              width="640"
              controls
              editing
              name="position"
            />
          </React.Fragment>
        </div>
      </div>
    </div>
  );
};
