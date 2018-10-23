import React from 'react';
import PropTypes from 'prop-types';
import { Consumer } from '../Context';
// import styled from 'styled-components';

/**
 * TODO: Make sure that when sending down props they are merged into state
 */

class Dialog extends React.Component {
  dialog = React.createRef();
  state = {};
  // shouldComponentUpdate(nextProps) {
  //   console.log(nextProps);
  //   console.log(this.props);
  //   if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) return true;
  //   return true;
  // }
  getDimensions = () => {
    return {
      dialogHeight: this.dialog.current?.offsetHeight,
      dialogWidth: this.dialog.current?.offsetWidth
    };
  };

  getCoordinatesOfDialogue = () => {
    let dialogTop;
    let dialogLeft;
    const {
      value: { x, y, width: valueWidth = 0, height: valueHeight = 0 } = {
        height: 0,
        width: 0,
        x: 0,
        y: 0
      },
      height,
      width
    } = this.props;
    const { dialogHeight, dialogWidth } = this.getDimensions();

    if (y + valueHeight > height) {
      dialogTop = height - dialogHeight;
    } else if (y + valueHeight + dialogHeight > height) {
      if (y - dialogHeight < 0) {
        dialogTop = 0;
      } else {
        dialogTop = y - dialogHeight;
      }
    } else {
      dialogTop = y + valueHeight;
    }
    if (x + valueWidth + dialogWidth > width) {
      if (x - dialogWidth < 0) {
        dialogLeft = 0;
      } else {
        dialogLeft = x - dialogWidth;
      }
    } else {
      dialogLeft = x + valueWidth;
    }

    return {
      left: Number.isNaN(dialogLeft) ? 0 : dialogLeft,
      top: Number.isNaN(dialogTop) ? 0 : dialogTop
    };
  };
  render() {
    const { isOpen, value, duration, changeTime } = this.props;
    return (
      <Consumer>
        {({ formComponent: Form }) => (
          <Form
            deepRef={this.dialog}
            values={{ ...value, duration }}
            changeTime={changeTime}
            style={{
              visibility: !isOpen && 'hidden',
              backgroundColor: 'white',
              padding: 2,
              position: 'absolute',
              zIndex: 5,
              ...this.getCoordinatesOfDialogue()
            }}
          />
        )}
      </Consumer>
    );
  }
}

Dialog.propTypes = {
  // onCancel: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  duration: PropTypes.number.isRequired,
  changeTime: PropTypes.func.isRequired,

  value: PropTypes.shape({
    endTimeCode: PropTypes.number,
    startTimeCode: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number
  }),
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
  // currentTime: PropTypes.number.isRequired,
  // name: PropTypes.string.isRequired
};

Dialog.defaultProps = {
  // onSubmit: () => {},
  // onChange: () => {},
  // changeTime: () => {},
  // onCancel: () => {},
  value: {}
};

export default Dialog;
