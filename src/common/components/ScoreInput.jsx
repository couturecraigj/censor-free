import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';

const ScoreInput = ({ label, name, id, min, max, step, ...props }) => {
  return (
    <Field name={name}>
      {({ field }) => (
        <React.Fragment>
          <div>
            <label htmlFor={id}>
              {label}
              {typeof value === 'number' && `: ${field.value}`}
            </label>
          </div>
          <div>
            <input
              {...props}
              {...field}
              min={min}
              max={max}
              step={step}
              type="range"
              id={id}
              placeholder={label}
            />
          </div>
        </React.Fragment>
      )}
    </Field>
  );
};

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
