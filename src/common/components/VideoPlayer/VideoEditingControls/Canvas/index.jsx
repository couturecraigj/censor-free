import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Stage, Layer } from 'react-konva';
import ErrorBoundary from '../../../ErrorBoundary';
import Transformer from './Transformer';
import Rect from './Rect';
/**
 * TODO: Make sure that when sending down props they are merged into state
 */
const Div = styled.div`
  position: absolute;
  z-index: 4;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  /* pointer-events: none; */
`;

class Canvas extends React.Component {
  stage = React.createRef();
  state = {
    selectedShapeName: ''
  };

  static getDerivedStateFromProps = (props, state) => {
    const value = {
      ...props?.value
    };
    return {
      ...state,
      value
    };
    // return null;
  };

  onMouseDown = e => {
    const { currentTime } = this.props;
    this.setState({
      mouseDown: true
    });
    const startTimeCode = Math.floor(currentTime);
    const marker = {
      startTimeCode,
      y: e.evt.layerY,
      x: e.evt.layerX
    };
    this.setState({
      startPosition: marker
    });
  };
  onMouseUp = e => {
    if (e.currentTarget !== e.currentTarget.getStage()) {
      // this.handleRectChange(newPosition);
      this.setState({
        mouseDown: false,
        startPosition: undefined
      });
    }
    const clickedOnTransformer =
      e.currentTarget.getParent()?.className === 'Transformer';
    if (clickedOnTransformer) {
      return;
    }
    const { currentTime } = this.props;
    const { mouseDown } = this.state;
    if (!mouseDown) return;
    this.setState({
      mouseDown: false
    });

    const { onChange } = this.props;
    const { startPosition } = this.state;
    const startTimeCode = Math.floor(currentTime);
    const marker = {
      startTimeCode,
      y: e.evt.layerY,
      x: e.evt.layerX
    };
    if (startPosition.y !== marker.y && startPosition.x !== marker.x) {
      const value = {
        ...marker,
        y: (() => {
          if (marker.y > startPosition.y) return startPosition.y;
          return marker.y;
        })(),
        x: (() => {
          if (marker.x > startPosition.x) return startPosition.x;
          return marker.x;
        })(),
        width: (() => {
          if (marker.x === startPosition.x) return 0;
          return Math.abs(marker.x - startPosition.x);
        })(),
        height: (() => {
          if (marker.y === startPosition.y) return 0;
          return Math.abs(marker.y - startPosition.y);
        })(),
        name: 'boundary'
      };
      onChange(value);
      this.setState({
        value,
        startPosition: undefined
      });
    }
  };
  handleStageMouseDown = e => {
    const { value } = this.state;
    if (e.target === e.target.getStage()) {
      this.setState({
        selectedShapeName: ''
      });
      return this.onMouseDown(e);
    }

    // clicked on transformer - do nothing
    const clickedOnTransformer =
      e.target.getParent().className === 'Transformer';
    if (clickedOnTransformer) {
      return;
    }

    // find clicked rect by its name
    const name = e.target.name();
    const rect = value.name === name;
    if (rect) {
      this.setState({
        selectedShapeName: name
      });
    } else {
      this.setState({
        selectedShapeName: ''
      });
    }
  };
  handleRectChange = newProps => {
    const { onChange } = this.props;
    const { value: oldPosition } = this.state;
    const value = {
      ...oldPosition,
      ...newProps
    };

    this.setState({ value });
    onChange(value);
  };
  render() {
    const { width, height } = this.props;
    const { selectedShapeName, value } = this.state;
    const valueExists = value?.height && value?.width && value?.y && value?.x;
    return (
      <Div>
        <ErrorBoundary width={width} height={height}>
          <Stage
            width={width}
            ref={this.stage}
            height={height}
            onContentMouseUp={this.onMouseUp}
            onMouseDown={this.handleStageMouseDown}
          >
            <Layer>
              {valueExists && (
                <Rect
                  {...value}
                  selected={value?.name === selectedShapeName}
                  stroke="black"
                  onTransform={this.handleRectChange}
                />
              )}

              {valueExists && (
                <Transformer selectedShapeName={selectedShapeName} />
              )}
            </Layer>
          </Stage>
        </ErrorBoundary>
      </Div>
    );
  }
}

Canvas.propTypes = {
  currentTime: PropTypes.number.isRequired,
  value: PropTypes.shape({
    y: PropTypes.number,
    x: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number
  }),
  onSubmit: PropTypes.func,
  onChange: PropTypes.func
};

Canvas.defaultProps = {
  onSubmit: () => {},
  onChange: () => {},
  value: undefined
};

export default Canvas;
