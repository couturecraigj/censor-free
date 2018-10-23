import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Canvas from './Canvas';
import Dialog from './Dialog';

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

class VideoEditingControls extends React.Component {
  state = {
    dialogHidden: true,
    duration: 0,
    startTimeCode: 0,
    endTimeCode: ''
  };
  componentDidMount() {
    this.replacePoster();
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.width !== nextProps.width) return true;
  //   const { value } = this.props;
  //   return (
  //     JSON.stringify(value) !== JSON.stringify(nextProps.value) ||
  //     JSON.stringify(this.state) !== JSON.stringify(nextState)
  //   );
  // }
  replacePoster = () => {
    const { changeTime } = this.props;
    setTimeout(() => {
      changeTime(0.1);
      setTimeout(() => {
        changeTime(0);
      }, 10);
    }, 500);
  };

  handleCancel = () => {
    const { changeTime } = this.props;
    const { startTimeCode } = this.state;
    changeTime(startTimeCode);
    this.setState({
      dialogHidden: true,
      startTimeCode: 0
    });
  };

  changePosition = value => {
    const { onChange, name } = this.props;
    this.setState({
      dialogHidden: value ? false : true
    });
    onChange({ target: { name, value } });
  };

  onChange = () => {
    // const { form } = this.props;
    const { video, onSubmit, value } = this.props;
    const { startTimeCode } = this.state;
    this.setState({
      dialogHidden: true,
      endTimeCode: 0
    });
    video.current.currentTime = startTimeCode || 0;
    onSubmit(value);
  };

  render() {
    const {
      duration,

      endTimeCode,
      dialogHidden,
      startTimeCode
    } = this.state;
    const {
      currentTime,
      value,
      name,
      changeTime,
      width,
      height,
      ...props
    } = this.props;
    // console.log({ width, height, value });
    return (
      <React.Fragment>
        <Canvas
          width={width}
          height={height}
          currentTime={currentTime}
          value={value}
          onChange={this.changePosition}
        />
        <Dialog
          isOpen={!dialogHidden}
          {...props}
          name={name}
          height={height}
          width={width}
          duration={duration}
          changeTime={changeTime}
          onCancel={this.handleCancel}
          onSubmit={this.onChange}
          onChange={this.changePosition}
          value={value}
          currentTime={currentTime}
        />
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
  changeTime: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  currentTime: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired
};

VideoEditingControls.defaultProps = {
  value: {},
  onChange: () => {},
  onSubmit: () => {}
};

export default VideoEditingControls;
