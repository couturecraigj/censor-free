import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Field, ErrorMessage } from 'formik';

const Area = styled.textarea`
  width: 100%;
  padding: 3px;
  border-radius: 3px;
  border: 1px solid black;
`;

const TextArea = ({ label, name, id, ...props }) => (
  <React.Fragment>
    <div>
      <label htmlFor={id}>{label}</label>
    </div>

    <Area {...props} name={name} id={id} placeholder={label} />
  </React.Fragment>
);

TextArea.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default TextArea;

export const FormikTextArea = ({ name, ...props }) => (
  <div>
    <Field name={name}>
      {({ field }) => (
        <TextArea {...props} {...field} value={field.value || ''} />
      )}
    </Field>
    <ErrorMessage name={name} />
  </div>
);
