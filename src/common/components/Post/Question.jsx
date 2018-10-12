import React from 'react';
import { Formik, Form } from 'formik';
import TextArea from '../TextArea';
import TextInput from '../TextInput';

const Question = () => (
  <Formik>
    {() => (
      <Form>
        <TextInput name="title" label="Subject" id="Question__subject" />
        <TextArea name="description" label="Body" id="Question__body" />
        <div>
          <button type="submit">Submit</button>
        </div>
      </Form>
    )}
  </Formik>
);

export default Question;
