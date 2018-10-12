import React from 'react';
import { Formik, Form } from 'formik';
import TextArea from '../TextArea';
import TextInput from '../TextInput';

const Tip = () => (
  <Formik>
    {() => (
      <Form>
        <TextInput name="title" label="Subject" id="Tip__subject" />
        <TextArea name="description" label="Body" id="Tip__body" />
        <div>
          <button type="submit">Submit</button>
        </div>
      </Form>
    )}
  </Formik>
);

export default Tip;
