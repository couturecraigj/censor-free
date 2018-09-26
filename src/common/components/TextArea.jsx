import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Area = styled.textarea`
  width: 100%;
  padding: 3px;
  border-radius: 3px;
  border: 1px solid black;
`;

const TextInput = ({ label, name, id, ...props }) => (
  <React.Fragment>
    <div>
      <label htmlFor={id}>{label}</label>
    </div>
    <Area {...props} name={name} id={id} placeholder={label} />
  </React.Fragment>
);

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default TextInput;
