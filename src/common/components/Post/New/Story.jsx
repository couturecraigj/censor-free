import React from 'react';
import { Formik, Form } from 'formik';
import TextArea from '../../TextArea';
import TextInput from '../../TextInput';

const Story = () => (
  <Formik>
    {() => (
      <Form>
        <TextInput name="title" label="Subject" id="Story__subject" />
        <TextArea name="description" label="Body" id="Story__body" />
        <div>
          <button type="submit">Submit</button>
        </div>
      </Form>
    )}
  </Formik>
);

export default Story;
