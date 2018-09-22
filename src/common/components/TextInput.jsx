import React from 'react';
import PropTypes from 'prop-types';

const TextInput = ({ label, id }) => (
  <React.Fragment>
    <div>
      <label htmlFor={id}>{label}</label>
    </div>
    <div>
      <input id={id} placeholder={label} />
    </div>
  </React.Fragment>
);

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

export default TextInput;
