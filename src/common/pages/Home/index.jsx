import React from 'react';
import { Helmet } from 'react-helmet';
import { Formik, Field, Form } from 'formik';
import VideoPlayer from '../../components/VideoPlayer';

// TODO: Make it so main pages gives a good overview

const renderForm = ({ deepRef, values, changeTime, ...props }) => {
  return (
    <Form>
      <div {...props} ref={deepRef}>
        <div>
          <Field name="position.type">
            {({ field }) => <input {...field} />}
          </Field>
        </div>
        <div>
          <Field name="position.endTimeCode">
            {({ field }) => {
              if (field.value !== undefined) changeTime(field.value);
              return (
                <input
                  {...field}
                  min={values.startTimeCode}
                  max={values.duration}
                  step="0.01"
                  type="number"
                />
              );
            }}
          </Field>
        </div>
      </div>
    </Form>
  );
};

export default () => {
  return (
    <div>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div>
        Home
        <div>
          <Formik defaultValues={{ edit: false }}>
            {({ values, handleChange }) => {
              return (
                <React.Fragment>
                  <VideoPlayer
                    src="http://localhost:3000/5bb3b25e69b02ed5724ab2ac/ab54bb64-696e-4bab-b866-947ceec26df0/bc3a04c7-f434-4206-a71d-9aa82db74ae1"
                    poster="http://localhost:3000/5bb3b25e69b02ed5724ab2ac/ab54bb64-696e-4bab-b866-947ceec26df0/bc3a04c7-f434-4206-a71d-9aa82db74ae1/1.png"
                    width="640"
                    value={values.position}
                    controls
                    formComponent={renderForm}
                    onEdit={handleChange}
                    name="position"
                    editing={values.edit}
                  />
                  <Field type="checkbox" name="edit" />
                </React.Fragment>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};
