import React from 'react';
import PropTypes from 'prop-types';

class ScoreInput extends React.Component {
  constructor(props) {
    super(props);
    this.scoreRef = React.createRef();
    this.state = {
      value: props.value
    };
  }
  onChange = () => {
    this.setState({
      value: this.scoreRef.current.valueAsNumber
    });
  };
  render() {
    const { label, name, id, min, max, step, ...props } = this.props;
    const { value } = this.state;
    return (
      <React.Fragment>
        <div>
          <label htmlFor={id}>
            {label}
            {typeof value === 'number' && `: ${value}`}
          </label>
        </div>
        <div>
          <input
            {...props}
            ref={this.scoreRef}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={this.onChange}
            type="range"
            name={name}
            id={id}
            placeholder={label}
          />
        </div>
      </React.Fragment>
    );
  }
}

ScoreInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  min: PropTypes.number,
  step: PropTypes.number,
  max: PropTypes.number
};

ScoreInput.defaultProps = {
  min: 0,
  value: '',
  step: 1,
  max: 100
};

export default ScoreInput;
