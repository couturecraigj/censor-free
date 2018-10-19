import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * TODO: Make sure that when sending down props they are merged into state
 */

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

const filterOptions = [
  'Sex',
  'Nudity',
  'Violence',
  'Weapons',
  'Frightening',
  'Gross',
  'Smoking',
  'Drugs',
  'Alcohol',
  'Language',
  'Privacy',
  'Scam',
  'Copyright'
];

class VideoEditingControls extends React.Component {
  canvas = React.createRef();
  dialog = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      width: 0,
      mouseDown: false,
      dialogHidden: true,
      filterType: '',
      duration: 0,
      startTimeCode: 0,
      endTimeCode: '',
      ...props.value
    };
  }
  componentDidMount() {
    this.ctx = this.canvas.current.getContext('2d');
    this.setDimensions();
    this.addListeners();
  }
  componentWillUnmount() {
    this.removeListeners();
  }

  removeListeners = () => {
    const { video } = this.props;
    try {
      video.current.removeEventListener('mouseup', this.onMouseUp);
      video.current.removeEventListener('mouseleave', this.onMouseUp);
      video.current.removeEventListener('mousedown', this.onMouseDown);
    } catch (e) {
      //
    }
  };
  addListeners = () => {
    const { video } = this.props;
    try {
      video.current.addEventListener('mouseup', this.onMouseUp);
      video.current.addEventListener('mouseleave', this.onMouseUp);
      video.current.addEventListener('mousedown', this.onMouseDown);
    } catch (e) {
      //
    }
  };
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
        const { height, width, startTimeCode } = this.state;
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
          endTimeCode: startTimeCode,
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
    const startTimeCode = Math.floor(vid.currentTime);
    const marker = {
      startTimeCode,
      top: e.layerY,
      left: e.layerX
    };
    this.setState({
      startPosition: marker,
      startTimeCode
    });
  };
  onMouseUp = e => {
    const { mouseDown } = this.state;
    if (!mouseDown) return;
    this.setState({
      mouseDown: false
    });

    const { video, onChange } = this.props;
    const vid = video.current;
    const { temporaryPause, startPosition } = this.state;
    const startTimeCode = Math.floor(vid.currentTime);
    const marker = {
      startTimeCode,
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
      onChange({
        target: {
          name,
          value: position
        }
      });
      this.addPositionToCanvas(position);
      this.setState(
        {
          startTimeCode,
          position,
          startPosition: undefined
        },
        () => this.createDialogue(e)
      );
    }
  };
  handleSubmit = e => {
    const { onSubmit } = this.props;
    const { position } = this.state;
    e.preventDefault();
    if (
      !filterOptions.includes(position.filterType) ||
      typeof position.endTimeCode !== 'number'
    )
      return;
    onSubmit(position);
    this.removePositionFromCanvas(position);
    this.setState({
      dialogHidden: true,
      endTimeCode: '',
      filterType: '',
      position: null
    });
  };
  onChange = () => {
    // const { form } = this.props;
    const { video, onSubmit } = this.props;
    const { position, startTimeCode } = this.state;
    this.setState({
      dialogHidden: true,
      endTimeCode: 0
    });
    video.current.currentTime = startTimeCode || 0;
    this.removePositionFromCanvas(position);
    onSubmit(position);
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
  handleChange = (e, value) => {
    const {
      startTimeCode,
      width,
      height,
      filterType,
      top,
      left,
      endTimeCode
    } = this.state;
    const { onChange, name } = this.props;
    let state = {};
    if (value) {
      state = {
        [e]: value,
        position: {
          startTimeCode,
          filterType,
          width,
          height,
          top,
          left,
          endTimeCode,
          [e]: value
        }
      };
    } else {
      e.preventDefault();
      state = {
        [e.target.name]: e.target.value,
        position: {
          startTimeCode,
          width,
          height,
          top,
          left,
          endTimeCode,
          [e.target.name]: e.target.value
        }
      };
    }
    onChange({
      target: {
        name,
        value: state.position
      }
    });
    this.setState(state);
  };
  changeEndTime = e => {
    const { video } = this.props;
    const endTimeCode = +e.target.value;
    if (endTimeCode <= e.target.max && endTimeCode >= e.target.min) {
      this.handleChange('endTimeCode', endTimeCode);
      video.current.currentTime = endTimeCode;
    }
  };
  changeStartTime = e => {
    const { video } = this.props;
    const startTimeCode = +e.target.value;
    if (startTimeCode <= e.target.max && startTimeCode >= e.target.min) {
      this.handleChange('startTimeCode', startTimeCode);
      video.current.currentTime = startTimeCode;
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
      endTimeCode,
      dialogLeft,
      dialogTop,
      dialogHidden,
      startTimeCode,
      filterType
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
        <form onSubmit={this.handleSubmit}>
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
            <div>
              <select
                required
                name="filterType"
                value={filterType}
                onChange={this.handleChange}
                placeholder="which"
              >
                <option value>--Select One--</option>
                {filterOptions.map(val => (
                  <option key={val}>{val}</option>
                ))}
              </select>
            </div>
            <div>
              <span>{`Starting at ${startTimeCode} of ${duration}`}</span>
              <input
                name="endTimeCode"
                required
                placeholder="until"
                type="number"
                step={0.25}
                min={startTimeCode}
                value={endTimeCode}
                max={duration}
                onChange={this.changeEndTime}
              />
            </div>
            <button type="submit">Add To List</button>
            <button type="button" onClick={this.cancelDialog}>
              Cancel
            </button>
          </div>
        </form>

        <RangeContainer>
          <RangeSlider
            value={dialogHidden ? startTimeCode : endTimeCode}
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
  }).isRequired,
  value: PropTypes.shape({
    startTimeCode: PropTypes.number,
    endTimeCode: PropTypes.number,
    height: PropTypes.number
  }),
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired
};

VideoEditingControls.defaultProps = {
  value: {},
  onSubmit: () => {},
  onChange: () => {}
};

export default VideoEditingControls;
