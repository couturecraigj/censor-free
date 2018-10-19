import React from 'react';
import PropTypes from 'prop-types';
import VideoControls from './VideoControls';
import VideoEditingControls from './VideoEditingControls';
// TODO: Add a Broken Video Image when a video does not load

class VideoPlayer extends React.Component {
  video = React.createRef();
  editor = React.createRef();
  controls = React.createRef();
  state = {
    height: 0,
    width: 0,
    hide: true
  };
  componentDidMount() {
    this.setDimensions();
    Promise.all([import('mux.js'), import('shaka-player')]).then(
      ([muxjs, result]) => {
        window.muxjs = muxjs.default;
        this.shaka = result.default;
        this.shaka.polyfill.installAll();
        if (this.shaka.Player.isBrowserSupported()) {
          this.initPlayer();
        } else {
          // eslint-disable-next-line no-console
          console.error('Browser not Supported');
        }
        return;
      }
    );
  }
  componentWillUnmount() {
    try {
      this.editor.current.removeListeners();
      this.controls.current.removeListeners();
    } catch (e) {
      //
    }
    this.player.removeEventListener('error', this.onErrorEvent);
  }
  initPlayer = async (appended = '/playlist.m3u8') => {
    const { src } = this.props;
    const manifestUri = src + appended;
    // eslint-disable-next-line no-console
    if (!this.player) {
      const player = new this.shaka.Player(this.video.current);

      // Attach player to the window to make it easy to access in the JS console.
      this.player = player;
    }

    // Listen for error events.
    this.player.addEventListener('error', this.onErrorEvent);

    // Try to load a manifest.
    // This is an asynchronous process.
    this.player
      .load(manifestUri)
      .then(() => {
        this.setDimensions();
        // This runs if the asynchronous load is successful.
        // eslint-disable-next-line no-console
        console.log('The video has now been loaded!');
      })
      // onError is executed if the asynchronous load fails.
      .catch(this.onError);
  };
  setDimensions = () => {
    const {
      offsetHeight: height,
      offsetWidth: width,
      duration
    } = this.video.current;
    if (!duration) {
      setTimeout(this.setDimensions, 200);
      this.setState({
        height,
        width
      });
    } else {
      this.setState({
        height,
        width,
        hide: false
      });
    }
  };
  onErrorEvent = event => {
    // Extract the shaka.util.Error object from the event.
    this.onError(event.detail);
  };
  onKeyDown = e => {
    const { editing } = this.props;
    if (editing) return;
    if (document.activeElement === this.video.current) {
      e.preventDefault();
      e.persist();
      const video = this.video.current;
      // console.log(e.keyCode);
      switch (e.keyCode) {
        case 32:
          return video.paused ? video.play() : video.pause();
        case 39:
          return (() => {
            let currentTime = video.currentTime + 1;
            if (currentTime <= video.duration)
              return (video.currentTime = currentTime);
            currentTime = video.duration;
            return (video.currentTime = currentTime - 0.0001);
          })();
        case 37:
          return (() => {
            const currentTime = video.currentTime - 1;
            if (currentTime >= 0) return (video.currentTime = currentTime);
            return (video.currentTime = 0);
          })();
        case 38:
          return (() => {
            const volume = video.volume + 0.1;
            if (volume <= 1) return (video.volume = volume);
            return (video.volume = 1);
          })();
        case 40:
          return (() => {
            const volume = video.volume - 0.1;
            if (volume >= 0) return (video.volume = volume);
            return (video.volume = 0);
          })();
        case 35:
          return (() => {
            video.currentTime = video.duration - 0.0000000001;
          })();
        case 77:
          return (() => {
            video.volume ? (video.volume = 0) : (video.volume = 1);
          })();
        // case 36:
        //   return (() => {
        //     const volume = video.volume - 0.1;
        //     if (volume >= 0) return (video.volume = volume);
        //     return (video.volume = 0);
        //   })();
        case 48:
          return (video.currentTime = 0);
        case 70:
          return (() => {
            const fullscreen =
              document.fullScreen ||
              document.mozFullScreen ||
              document.webkitIsFullScreen;
            if (!fullscreen) {
              if (video.requestFullscreen) {
                video.requestFullscreen();
              } else if (video.mozRequestFullScreen) {
                video.mozRequestFullScreen();
              } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
              }
            } else {
              if (video.exitFullscreen) {
                video.exitFullscreen();
              } else if (video.mozExitFullScreen) {
                video.mozExitFullScreen();
              } else if (document.exitFullscreen) {
                document.exitFullscreen();
              } else if (video.webkitExitFullscreen) {
                video.webkitExitFullscreen();
              }
            }
          })();
        default:
          return;
      }
    }
  };
  onError = async error => {
    if ([3016].includes(error.code)) {
      await this.player.unload();
      return this.initPlayer('.mpd');
    }
    // Log the error.
    // eslint-disable-next-line no-console
    console.error('Error code', error.code, 'object', error);
  };
  focus = () => {
    this.video.current.focus();
  };
  render() {
    // const video = this.video?.current;
    const {
      poster,
      src,
      width: propWidth,
      onSubmit,
      controls,
      autoPlay,
      editing,
      ...props
    } = this.props;
    const { width, height, hide } = this.state;

    return (
      <React.Fragment>
        {editing && (
          <div>
            <h1>Please help to edit this video</h1>
            <div>
              You can Scrub to the beginning of where a potential event is
              happening then drag over the area that is of concern and then add
              the appropriate amount of time that the event has occurred before
              submitting.
            </div>
            <div>
              Also, you need to provide a category for each filterable event
            </div>
          </div>
        )}
        <div
          hidden={hide}
          style={{
            position: 'relative',
            width,
            height: editing ? height + 25 : height
          }}
        >
          <div style={{ width, height, zIndex: 1 }}>&nbsp;</div>
          <video
            tabIndex="-1"
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
            ref={this.video}
            onClick={this.focus}
            width={propWidth}
            onKeyDown={this.onKeyDown}
            src={src + '/playlist.m3u8'}
            poster={poster}
            autoPlay={!editing && autoPlay}
          >
            <track kind="captions" />
          </video>
          {editing &&
            !hide && (
              <VideoEditingControls
                {...props}
                ref={this.editor}
                onSubmit={onSubmit}
                width={width}
                height={height}
                video={this.video}
              />
            )}
          {controls &&
            !hide &&
            !editing && (
              <VideoControls ref={this.controls} video={this.video} />
            )}
        </div>
      </React.Fragment>
    );
  }
}

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  poster: PropTypes.string.isRequired,
  controls: PropTypes.bool,
  editing: PropTypes.bool,
  onSubmit: PropTypes.func,
  autoPlay: PropTypes.bool
};

VideoPlayer.defaultProps = {
  controls: false,
  autoPlay: false,
  editing: false,
  onSubmit: () => {}
};

export default VideoPlayer;
