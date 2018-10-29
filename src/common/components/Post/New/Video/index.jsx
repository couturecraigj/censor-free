import React from 'react';
import PropTypes from 'prop-types';
import FirstStep from './FirstStep';
import SecondStep from './SecondStep';
import Conversion from './Conversion';

class Video extends React.Component {
  state = {
    step: 1,
    videoId: ''
  };
  max = 3;

  nextStep = () => {
    const { step } = this.state;
    const { toggleTabs } = this.props;
    const { max } = this;

    if (step < max + 1) {
      toggleTabs();
      this.setState({
        step: step + 1
      });
    }
  };

  previousStep = () => {
    const { step } = this.state;

    if (step > 1)
      this.setState({
        step: step - 1
      });
  };

  render() {
    const { step, videoId, videoUri, uploadToken, converted } = this.state;

    if (step === 1)
      return (
        <FirstStep
          nextStep={(data, variables) => {
            this.setState(
              {
                videoId: data.addVideo.id,
                videoUri: data.addVideo.uri,
                converted: data.addVideo.converted,
                uploadToken: variables.uploadToken
              },
              () => {
                this.nextStep();
              }
            );
          }}
        />
      );

    if (!converted)
      return (
        <Conversion
          uploadToken={uploadToken}
          nextStep={() =>
            this.setState({
              converted: true
            })
          }
        />
      );

    if (step === 2)
      return (
        <SecondStep
          videoId={videoId}
          videoUri={videoUri}
          uploadToken={uploadToken}
          converted={converted}
          previousStep={() => {
            const { toggleTabs } = this.props;

            this.previousStep();
            toggleTabs(true);
          }}
          nextStep={data => {
            this.setState(
              {
                videoId: data.addVideo.id
              },
              () => {
                this.nextStep();
              }
            );
          }}
        />
      );

    return null;
  }
}

Video.propTypes = {
  toggleTabs: PropTypes.func.isRequired
};

export default Video;
