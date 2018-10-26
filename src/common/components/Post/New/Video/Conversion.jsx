import React from 'react';
import PropTypes from 'prop-types';
import { Subscription } from 'react-apollo';
import gql from 'graphql-tag';
import Progress from '../../../Progress';

const FILE_CONVERSION_PROGRESS = gql`
  subscription FileConversionProgress($uploadToken: String!) {
    fileConversionProgress(uploadToken: $uploadToken)
  }
`;

const VideoConversion = ({ uploadToken, nextStep }) => {
  return (
    <Subscription
      subscription={FILE_CONVERSION_PROGRESS}
      variables={{ uploadToken }}
      should
    >
      {({ data, loading }) => {
        if (loading) return <div>Loading...</div>;
        if (data.fileConversionProgress !== 100)
          return (
            <div>
              <h2>File Is Being Converted to Web Formats</h2>
              <Progress progress={data.fileConversionProgress} />
            </div>
          );
        if (data.fileConversionProgress === 100) {
          nextStep();
          return (
            <div>
              <h2>File Is Being Converted to Web Formats</h2>
              <Progress progress={100} />
            </div>
          );
        }
        return (
          <div>
            <h2>UNMET NEED</h2>
          </div>
        );
      }}
    </Subscription>
  );
};

VideoConversion.propTypes = {
  uploadToken: PropTypes.string.isRequired,
  nextStep: PropTypes.func.isRequired
};

export default VideoConversion;
