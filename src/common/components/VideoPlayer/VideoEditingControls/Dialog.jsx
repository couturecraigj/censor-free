import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

/**
 * TODO: Make sure that when sending down props they are merged into state
 */

class Dialog extends React.Component {
  dialog = React.createRef();
  state = {};
  static getDerivedStateFromProps = (props, state) => {
    if (props.position) {
      const position = {
        ...state?.position,
        ...props?.position
      };
      return {
        ...state,
        position
      };
    }
    return null;
  };
  getDimensions = () => {
    return {
      dialogHeight: this.dialog.current?.offsetHeight,
      dialogWidth: this.dialog.current?.offsetWidth
    };
  };
  handleSubmit = e => {
    const { onSubmit, value } = this.props;
    e.preventDefault();
    onSubmit(value);
  };
  cancelDialog = () => {
    const { onCancel } = this.props;
    onCancel();
  };
  handleChange = (e, newValue) => {
    const { onChange, value } = this.props;
    const state = {};
    if (!newValue) {
      e.preventDefault();
      e.persist();
    }
    this.setState(state, () => {
      onChange({
        ...value,
        ...(newValue
          ? { [e]: newValue }
          : { [e.target?.name]: e.target?.value })
      });
    });
  };
  changeEndTime = e => {
    const { changeTime, onChange, value } = this.props;
    changeTime(e.target.value);
    onChange({
      ...value,
      endTimeCode: +e.target.value
    });
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

    return { left: dialogLeft, top: dialogTop };
  };
  render() {
    const { isOpen, formComponent: Form } = this.props;
    return (
      <Form
        innerRef={this.dialog}
        style={{
          visibility: !isOpen && 'hidden',
          backgroundColor: 'white',
          padding: 2,
          position: 'absolute',
          zIndex: 2,
          ...this.getCoordinatesOfDialogue()
        }}
      />
    );
  }
}

Dialog.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  formComponent: PropTypes.func,
  onCancel: PropTypes.func,
  changeTime: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  // duration: PropTypes.number.isRequired,

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
  onSubmit: () => {},
  onChange: () => {},
  formComponent: ({ innerRef, ...props }) => (
    <form {...props} ref={innerRef}>
      <input />
    </form>
  ),
  changeTime: () => {},
  onCancel: () => {},
  value: {}
};

export default Dialog;
