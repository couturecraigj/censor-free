import React from 'react';
import { Formik, Form } from 'formik';
import TextArea from '../TextArea';
import TextInput from '../TextInput';
import ScoreInput from '../ScoreInput';

const Review = () => (
  <Formik>
    {() => (
      <Form>
        <ScoreInput name="score" label="Score" id="Review__score" />
        <TextInput name="title" label="Subject" id="Review__subject" />
        <TextArea name="description" label="Body" id="Review__body" />
        <div>
          <button type="submit">Submit</button>
        </div>
      </Form>
    )}
  </Formik>
);

export default Review;
