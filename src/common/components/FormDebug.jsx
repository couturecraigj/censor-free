import React from 'react';
import { Field } from 'formik';

const __DEV__ = process.env.NODE_ENV !== 'production';
const FormDebugger = () => {
  return (
    <Field name="___DEBUGGER___">
      {({ form }) => <pre>{JSON.stringify(form, null, 2)}</pre>}
    </Field>
  );
};

export default (__DEV__ ? FormDebugger : null);
