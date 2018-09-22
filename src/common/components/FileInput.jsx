import React from 'react';
import PropTypes from 'prop-types';

const TextInput = ({ label, id }) => (
  <label>
    {label}
    <div>
      <input type="file" id={id} />
    </div>
  </label>
);

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

export default TextInput;
