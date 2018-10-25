import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Field, ErrorMessage } from 'formik';

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
      {/* <Input {...props} {...field} placeholder={label} id={id} /> */}

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

export const FormikTextInput = ({ name, ...props }) => (
  <div>
    <Field name={name} {...props}>
      {({ field }) => (
        <TextInput {...props} {...field} value={field.value || ''} />
      )}
    </Field>
    <ErrorMessage name={name} />
  </div>
);

FormikTextInput.propTypes = {
  name: PropTypes.string.isRequired
};
