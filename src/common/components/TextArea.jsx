import React from 'react';
import PropTypes from 'prop-types';

const TextInput = ({ label, name, id, ...props }) => (
  <React.Fragment>
    <div>
      <label htmlFor={id}>{label}</label>
    </div>
    <textarea {...props} name={name} id={id} placeholder={label} />
  </React.Fragment>
);

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default TextInput;
