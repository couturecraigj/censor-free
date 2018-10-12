import React from 'react';
import { Formik, Form } from 'formik';
import TextArea from '../TextArea';
import TextInput from '../TextInput';

const Thought = () => (
  <Formik>
    {() => (
      <Form>
        <TextInput name="title" label="Subject" id="Thought__subject" />
        <TextArea name="description" label="Body" id="Thought__body" />
        <div>
          <button type="submit">Submit</button>
        </div>
      </Form>
    )}
  </Formik>
);

export default Thought;
