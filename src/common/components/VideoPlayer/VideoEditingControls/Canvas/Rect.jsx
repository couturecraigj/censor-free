/* eslint-disable react/no-multi-comp */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Rect as Rectangle } from 'react-konva';

class Rect extends React.PureComponent {
  handleChange = e => {
    const { onTransform, x, y, width, height } = this.props;
    const shape = e.target;
    const newPosition = {
      ...{ x, y, width, height },
      x: shape.x(),
      y: shape.y(),
      width: shape.width() * shape.scaleX(),
      height: shape.height() * shape.scaleY()
    };

    // take a look into width and height properties
    // by default Transformer will change scaleX and scaleY
    // while transforming
    // so we need to adjust that properties to width and height
    onTransform(newPosition, 'rect');
  };
  onMouseEnter = e => {
    const { selected } = this.props;
    const stage = e.target.getStage();
    if (selected) return (stage.container().style.cursor = 'grab');
    stage.container().style.cursor = 'pointer';
  };

  onMouseLeave = e => {
    const stage = e.target.getStage();
    stage.container().style.cursor = 'crosshair';
  };
  render() {
    const { x, y, width, height, stroke, name } = this.props;
    return (
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        onMouseEnter={this.onMouseEnter}
        onMouseMove={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        // force no scaling
        // otherwise Transformer will change it
        scaleX={1}
        scaleY={1}
        stroke={stroke}
        name={name}
        // save state on dragend or transformend
        onDragEnd={this.handleChange}
        onTransformEnd={this.handleChange}
        draggable
      />
    );
  }
}

Rect.propTypes = {
  onTransform: PropTypes.func,
  height: PropTypes.number.isRequired,
  selected: PropTypes.bool,
  width: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  stroke: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

Rect.defaultProps = {
  onTransform: () => {},
  selected: false
};

export default Rect;
