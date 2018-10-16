import React from 'react';
import PropTypes from 'prop-types';
import muxjs from 'mux.js';

class VideoPlayer extends React.Component {
  video = React.createRef();
  componentDidMount() {
    window.muxjs = muxjs;
    // console.log(window.muxjs);
    // window.muxjs = mux;
    import('shaka-player').then(result => {
      this.shaka = result.default;
      this.shaka.polyfill.installAll();
      if (this.shaka.Player.isBrowserSupported()) {
        this.initPlayer();
      } else {
        // eslint-disable-next-line no-console
        console.error('Browser not Supported');
      }
      return;
    });
  }
  onErrorEvent = event => {
    // Extract the shaka.util.Error object from the event.
    this.onError(event.detail);
  };

  onError = async error => {
    if ([3016].includes(error.code)) {
      await this.player.destroy();
      return this.initPlayer('.mpd');
    }
    // Log the error.
    // eslint-disable-next-line no-console
    console.error('Error code', error.code, 'object', error);
  };
  onClick = e => {
    console.log(e);
  };
  initPlayer = async (appended = '/playlist.m3u8') => {
    const { src } = this.props;
    const manifestUri = src + appended;
    console.log(manifestUri);
    // try {
    //   const result = await fetch(manifestUri).then(response => response.text());
    //   this.video.current.src = manifestUri;
    // } catch (e) {
    // console.error(e);
    const player = new this.shaka.Player(this.video.current);

    // Attach player to the window to make it easy to access in the JS console.
    this.player = player;

    // Listen for error events.
    player.addEventListener('error', this.onErrorEvent);

    // Try to load a manifest.
    // This is an asynchronous process.
    player
      .load(manifestUri)
      .then(function() {
        // This runs if the asynchronous load is successful.
        // eslint-disable-next-line no-console
        console.log('The video has now been loaded!');
      })
      .catch(this.onError); // onError is executed if the asynchronous load fails.
    // }
  };

  render() {
    const { poster, src, width, controls, autoPlay } = this.props;

    return (
      <video
        ref={this.video}
        width={width}
        src={src + '/playlist.m3u8'}
        // onClick={this.onClick}
        poster={poster}
        controls={controls}
        autoPlay={autoPlay}
      >
        <track kind="captions" />
      </video>
    );
  }
}

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  poster: PropTypes.string.isRequired,
  controls: PropTypes.bool,
  autoPlay: PropTypes.bool
};

VideoPlayer.defaultProps = {
  controls: false,
  autoPlay: false
};

export default VideoPlayer;
