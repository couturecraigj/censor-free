import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const RangeSlider = styled.input.attrs({
  type: 'range'
})`
  width: 100%;
`;
const RangeContainer = styled.div`
  display: block;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
`;

class VideoEditingControls extends React.Component {
  canvas = React.createRef();
  dialog = React.createRef();
  state = {
    height: 0,
    width: 0,
    mouseDown: false,
    dialogHidden: true,
    duration: 0,
    startTime: 0,
    endTime: ''
  };
  componentDidMount() {
    this.ctx = this.canvas.current.getContext('2d');
    this.setDimensions();
    const { video } = this.props;
    video.current.addEventListener('mouseup', this.onMouseUp);
    video.current.addEventListener('mouseleave', this.onMouseUp);
    video.current.addEventListener('mousedown', this.onMouseDown);
  }
  componentWillUnmount() {
    const { video } = this.props;
    video.current.removeEventListener('mouseup', this.onMouseUp);
    video.current.removeEventListener('mouseleave', this.onMouseUp);
    video.current.removeEventListener('mousedown', this.onMouseDown);
  }
  setDimensions = () => {
    const { video } = this.props;
    const {
      offsetHeight: height,
      offsetWidth: width,
      duration
    } = video.current;
    if (!duration) {
      setTimeout(this.setDimensions, 0);
    } else {
      this.setState({
        duration: +duration,
        height,
        width
      });
    }
  };
  onErrorEvent = event => {
    // Extract the shaka.util.Error object from the event.
    this.onError(event.detail);
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

  createDialogue = e => {
    this.setState(
      {
        dialogHidden: false
      },
      () => {
        let dialogTop;
        let dialogLeft;
        const { height, width, startTime } = this.state;
        // setTimeout(() => {});
        const [dialogHeight, dialogWidth, top, left] = [
          this.dialog.current.offsetHeight,
          this.dialog.current.offsetWidth,
          e.layerY,
          e.layerX
        ];

        if (top + dialogHeight > height) {
          const {
            position: { height: positionHeight } = { height: 0 }
          } = this.state;
          dialogTop = top - dialogHeight - positionHeight;
        } else {
          dialogTop = top;
        }
        if (left + dialogWidth > width) {
          const {
            position: { width: positionWidth } = { width: 0 }
          } = this.state;
          dialogLeft = left - dialogWidth - positionWidth;
        } else {
          dialogLeft = left;
        }
        this.setState({
          endTime: startTime,
          dialogHidden: false,
          dialogTop,
          dialogLeft
        });
      }
    );
  };
  onMouseDown = e => {
    const { video } = this.props;
    this.setState({
      mouseDown: true
    });
    const vid = video.current;
    // console.log(e.pointerId);
    if (!vid.paused) {
      vid.pause();
      this.setState({
        temporaryPause: true
      });
    }
    const startTime = Math.floor(vid.currentTime);
    const marker = {
      startTime,
      top: e.layerY,
      left: e.layerX
    };
    this.setState({
      startPosition: marker,
      startTime
    });
  };
  onMouseUp = e => {
    const { mouseDown } = this.state;
    if (!mouseDown) return;
    this.setState({
      mouseDown: false
    });
    const { video } = this.props;
    const vid = video.current;
    const { temporaryPause, startPosition } = this.state;
    const startTime = Math.floor(vid.currentTime);
    const marker = {
      startTime,
      top: e.layerY,
      left: e.layerX
    };

    if (
      startPosition.top !== marker.top &&
      startPosition.left !== marker.left
    ) {
      if (temporaryPause) {
        this.setState({
          temporaryPause: false
        });
        vid.play();
      }
      const position = {
        ...marker,
        top: (() => {
          if (marker.top > startPosition.top) return startPosition.top;
          return marker.top;
        })(),
        left: (() => {
          if (marker.left > startPosition.left) return startPosition.left;
          return marker.left;
        })(),
        width: (() => {
          if (marker.left === startPosition.left) return 0;
          return Math.abs(marker.left - startPosition.left);
        })(),
        height: (() => {
          if (marker.top === startPosition.top) return 0;
          return Math.abs(marker.top - startPosition.top);
        })()
      };
      this.addPositionToCanvas(position);
      this.setState(
        {
          startTime,
          position,
          startPosition: undefined
        },
        () => this.createDialogue(e)
      );
    }
  };
  onSubmit = e => {
    e.preventDefault();
    const { video } = this.props;
    const { position, startTime } = this.state;
    e.persist();
    this.setState({
      dialogHidden: true,
      endTime: 0
    });
    video.current.currentTime = startTime || 0;
    this.removePositionFromCanvas(position);
  };
  cancelDialog = () => {
    const { position } = this.state;
    this.removePositionFromCanvas(position);
    this.setState({
      dialogHidden: true,
      position: null
    });
  };
  addPositionToCanvas = position => {
    const canvas = this.canvas.current;
    this.ctx = canvas.getContext('2d');
    this.ctx.strokeRect(
      position.left,
      position.top,
      position.width,
      position.height
    );
  };
  changeEndTime = e => {
    const { video } = this.props;
    const endTime = +e.target.value;
    if (endTime <= e.target.max && endTime >= e.target.min) {
      this.setState({
        endTime
      });
      video.current.currentTime = endTime;
    }
  };
  changeStartTime = e => {
    const { video } = this.props;
    const startTime = +e.target.value;
    if (startTime <= e.target.max && startTime >= e.target.min) {
      this.setState({
        startTime
      });
      video.current.currentTime = startTime;
    }
  };
  removePositionFromCanvas = () => {
    const { video } = this.props;
    const height = video.current.offsetHeight;
    const width = video.current.offsetWidth;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.save();
    this.ctx = this.canvas.current.getContext('2d');
  };

  seek = e => {
    const { video } = this.props;
    video.current.currentTime = +e.target.value;
  };
  render() {
    const {
      width,
      duration,
      height,
      endTime,
      dialogLeft,
      dialogTop,
      dialogHidden,
      startTime
    } = this.state;

    return (
      <React.Fragment>
        <canvas
          ref={this.canvas}
          width={width}
          height={height}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            width,
            height,
            zIndex: 1
          }}
        >
          &nbsp;
        </canvas>
        <div
          ref={this.dialog}
          hidden={dialogHidden}
          style={{
            backgroundColor: 'white',
            padding: 2,
            position: 'absolute',
            zIndex: 2,
            top: dialogTop,
            left: dialogLeft
          }}
        >
          <form onSubmit={this.onSubmit}>
            <div>
              <input placeholder="which" />
            </div>
            <div>
              <input placeholder="which" />
            </div>
            <div>
              <input placeholder="which" />
            </div>
            <div>
              <span>{`Starting at ${startTime} of ${duration}`}</span>
              <input
                placeholder="until"
                type="number"
                step={0.25}
                min={startTime}
                value={endTime}
                max={duration}
                onChange={this.changeEndTime}
              />
            </div>
            <input type="submit" />
            <button type="button" onClick={this.cancelDialog}>
              Cancel
            </button>
          </form>
        </div>
        <RangeContainer>
          <RangeSlider
            value={dialogHidden ? startTime : endTime}
            disabled={!dialogHidden}
            max={duration}
            min={0}
            step={0.1}
            onChange={this.changeStartTime}
          />
        </RangeContainer>
      </React.Fragment>
    );
  }
}

VideoEditingControls.propTypes = {
  video: PropTypes.shape({
    current: PropTypes.object
  }).isRequired
};

export default VideoEditingControls;
