import React from 'react';
import PropTypes from 'prop-types';
import FirstStep from './FirstStep';
import SecondStep from './SecondStep';

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
    const { step, videoId, videoUri } = this.state;
    if (step === 1)
      return (
        <FirstStep
          nextStep={data => {
            this.setState(
              {
                videoId: data.addVideo.id,
                videoUri: data.addVideo.uri
              },
              () => {
                this.nextStep();
              }
            );
          }}
        />
      );
    if (step === 2)
      return (
        <SecondStep
          videoId={videoId}
          videoUri={videoUri}
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
