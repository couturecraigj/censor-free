import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Input = styled.input`
  width: 100%;
  border-radius: 3px;
  padding: 3px;
  border: 1px solid black;
`;
const InputContainer = styled.div`
  margin: 3px;
`;
const TextInput = ({ label, name, id, ...props }) => (
  <InputContainer>
    <div>
      <label htmlFor={id}>{label}</label>
    </div>
    <div>
      <Input {...props} name={name} id={id} placeholder={label} />
    </div>
  </InputContainer>
);

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default TextInput;