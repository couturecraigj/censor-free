import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const VolumeRange = styled.input.attrs({
  orient: 'vertical',
  type: 'range',
  max: 1,
  min: 0,
  step: 0.05
})`
  writing-mode: bt-lr; /* IE */
  -webkit-appearance: slider-vertical; /* WebKit */
  width: 8px;
  height: 75px;
  padding: 0 5px;
`;
const SeekSlider = styled.input.attrs({
  type: 'range',
  min: 0,
  step: 0.05
})`
  width: 100%;
`;
const PlayPauseButton = styled.button.attrs({
  type: 'button'
})`
  &:after {
    ${({ playing }) =>
      playing
        ? css`
            content: '\u2759 \u2759';
          `
        : css`
            content: '\u25B6';
          `};
  }
`;

const MuteButton = styled.button.attrs({
  type: 'button'
})`
  &:after {
    content: 'Mute';
  }
`;
const FullscreenButton = styled.button.attrs({
  type: 'button'
})`
  &:after {
    content: 'Fullscreen';
  }
`;

class VideoControls extends React.Component {
  state = {
    currentTime: 0,
    storedVolume: 1,
    // muted: false,
    volume: 1,
    playing: false,
    fullscreen: false,
    optionsVisible: false
  };
  componentDidMount() {
    const { video } = this.props;
    // console.log(video.current);
    this.getCurrentTime();
    video.current.addEventListener('playing', this.playing);
    video.current.addEventListener('play', this.playing);
    video.current.addEventListener('timeupdate', this.getCurrentTime);
    video.current.addEventListener('pause', this.paused);
    video.current.addEventListener('ended', this.paused);
    video.current.addEventListener('volumechange', this.volumeChanged);
    video.current.addEventListener(
      'webkitfullscreenchange',
      this.fullScreenChange
    );
    video.current.addEventListener(
      'mozfullscreenchange',
      this.fullScreenChange
    );
    video.current.addEventListener('fullscreenchange', this.fullScreenChange);
  }
  componentWillUnmount() {
    const { video } = this.props;
    video.current.removeEventListener('playing', this.playing);
    video.current.removeEventListener('play', this.playing);
    video.current.removeEventListener('timeupdate', this.getCurrentTime);
    video.current.removeEventListener('pause', this.paused);
    video.current.removeEventListener('ended', this.paused);
    video.current.removeEventListener('volumechange', this.volumeChanged);
    video.current.removeEventListener(
      'webkitfullscreenchange',
      this.fullScreenChange
    );
    video.current.removeEventListener(
      'mozfullscreenchange',
      this.fullScreenChange
    );
    video.current.removeEventListener(
      'fullscreenchange',
      this.fullScreenChange
    );
  }
  getDurationText = () => {
    const { video } = this.props;
    if (!video.current) return '';
    const { duration } = video.current;
    const seconds = Math.floor(duration % 60);
    if (Number.isNaN(seconds)) return '0:00';
    const minutes = Math.floor((duration - seconds) % 360);
    return `${minutes}:${('' + seconds).padStart(2, '0')}`;
  };
  getCurrentTimeText = () => {
    const { video } = this.props;
    if (!video.current) return '';
    const { currentTime } = video.current;
    const seconds = Math.floor(currentTime % 60);
    if (Number.isNaN(seconds)) return '0:00';
    const minutes = Math.floor((currentTime - seconds) % 360);
    return `${minutes}:${('' + seconds).padStart(2, '0')}`;
  };
  getCurrentTime = () => {
    const { video } = this.props;
    const { duration } = this.state;
    this.setState({
      currentTime: video.current.currentTime,
      duration: Number.isNaN(video.current.duration)
        ? duration
        : video.current.duration
    });
  };
  volumeChanged = e => {
    e.preventDefault();
    const { volume } = this.state;
    const { volume: videoVolume } = e.target;
    let { storedVolume } = this.state;
    if (videoVolume === 1 && volume === 0) {
      this.setState({
        volume: videoVolume,
        storedVolume
      });
      return (e.target.volume = storedVolume);
    }

    if (videoVolume !== 0) {
      storedVolume = videoVolume;
    }

    this.setState({
      volume: videoVolume,
      storedVolume
    });
  };
  toggleMute = () => {
    (() => {
      const { video } = this.props;
      const { storedVolume } = this.state;
      const videoVolume = video.current.volume;

      if (videoVolume > 0) {
        video.current.volume = 0;
        this.setState({
          storedVolume: videoVolume,
          volume: 0
        });
      } else {
        video.current.volume = storedVolume;
        this.setState({
          volume: storedVolume
        });
      }
    })();
  };
  fullScreenChange = () => {
    const fullscreen =
      document.fullScreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreen;
    this.setState({
      fullscreen
    });
  };
  toggleOptions = () => {
    const { optionsVisible } = this.state;
    this.setState({
      optionsVisible: !optionsVisible
    });
  };
  toggleFullScreenMode = () => {
    const {
      video: { current: video }
    } = this.props;
    const { fullscreen: fScreen } = this.state;
    let fullscreen = fScreen;
    if (!fScreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
        fullscreen = true;
      } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
        fullscreen = true;
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
        fullscreen = true;
      }
    } else {
      if (video.exitFullscreen) {
        video.exitFullscreen();
        fullscreen = false;
      } else if (video.mozExitFullScreen) {
        video.mozExitFullScreen();
        fullscreen = false;
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
        fullscreen = false;
      } else if (video.webkitExitFullscreen) {
        video.webkitExitFullscreen();
        fullscreen = false;
      }
    }
    this.setState({ fullscreen });
  };
  paused = () => {
    // const { video } = this.props;
    this.setState({
      playing: false
    });
  };
  volumeChange = e => {
    const { video } = this.props;
    const volume = +e.target.value;
    video.current.volume = volume;
    this.setState({
      volume
    });
  };
  playing = () => {
    // const { video } = this.props;
    this.setState({
      playing: true
    });
  };
  togglePlay = () => {
    const { playing: isPlaying } = this.state;
    let playing = false;
    if (isPlaying) {
      this.pause();
      playing = false;
    } else {
      this.play();
      playing = true;
    }
    this.setState({
      playing
    });
  };
  play = () => {
    const { video } = this.props;
    video.current.play();
  };
  pause = () => {
    const { video } = this.props;
    video.current.pause();
  };
  seek = e => {
    const { video } = this.props;
    video.current.currentTime = e.target.value;
  };
  render() {
    const {
      duration,
      volume,
      currentTime,
      playing,
      optionsVisible
    } = this.state;
    return (
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          padding: '2px 20px',
          right: 0
        }}
      >
        <span>
          {`${this.getCurrentTimeText()} / ${this.getDurationText()}`}
        </span>
        <PlayPauseButton playing={playing} onClick={this.togglePlay} />
        <VolumeRange value={volume} onChange={this.volumeChange} />
        <MuteButton onClick={this.toggleMute} />
        <FullscreenButton onClick={this.toggleFullScreenMode} />
        <button type="button" onClick={this.toggleOptions}>
          Options
        </button>
        {optionsVisible && (
          <select>
            <option>Closed Captions</option>
          </select>
        )}
        <SeekSlider value={currentTime} max={duration} onChange={this.seek} />
      </div>
    );
  }
}

VideoControls.propTypes = {
  video: PropTypes.shape({
    current: PropTypes.object
  }).isRequired
  // width: PropTypes.string.isRequired,
  // poster: PropTypes.string.isRequired,
  // controls: PropTypes.bool,
  // editing: PropTypes.bool,
  // autoPlay: PropTypes.bool
};

// VideoControls.defaultProps = {
//   controls: false,
//   autoPlay: false,
//   editing: false
// };

export default VideoControls;
