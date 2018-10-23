import React from 'react';
import { Helmet } from 'react-helmet';
import { Formik, Field, Form } from 'formik';
import VideoPlayer from '../../components/VideoPlayer';

// TODO: Make it so main pages gives a good overview

export default class extends React.Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <div>
          Home
          <div>
            <Formik>
              {({ values, handleChange }) => {
                return (
                  <VideoPlayer
                    src="http://localhost:3000/5bb3b25e69b02ed5724ab2ac/92f21ad0-6983-4de2-8fd9-0288ff1f273f/259e0e29-1ef3-4886-aa00-aa38e9ecaffb"
                    poster="http://localhost:3000/5bb3b25e69b02ed5724ab2ac/92f21ad0-6983-4de2-8fd9-0288ff1f273f/259e0e29-1ef3-4886-aa00-aa38e9ecaffb/1.png"
                    width="640"
                    value={values.position}
                    controls
                    formComponent={({ deepRef, ...props }) => {
                      console.log('FORM COMPONENT');
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
                                  return <input {...field} type="number" />;
                                }}
                              </Field>
                            </div>
                          </div>
                        </Form>
                      );
                    }}
                    onEdit={handleChange}
                    name="position"
                    editing
                  />
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    );
  }
}
