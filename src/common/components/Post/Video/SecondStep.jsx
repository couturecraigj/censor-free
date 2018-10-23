import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { Field, Form, Formik, FieldArray } from 'formik';
import gql from 'graphql-tag';
import VideoPlayer from '../../VideoPlayer';
import FormDebug from '../../FormDebug';
import { secondsToHours } from '../../../utilities/convertNumberIntoTime';

/**
 * TODO: get the second step finished
 */

const ADD_VIDEO_FILTERS = gql`
  mutation AddVideoFilters(
    $uploadToken: String!
    $description: String!
    $title: String!
  ) {
    addVideoFilters(
      uploadToken: $uploadToken
      description: $description
      title: $title
    ) {
      id
      uri
    }
  }
`;

class VideoSecondStep extends React.Component {
  state = {
    positions: []
  };

  addPositionToList = position => {
    // const { handleSubmit } = this.props;
    const { positions } = this.state;
    this.setState({
      positions: [...positions, position]
    });
    // handleSubmit({ positions });
  };
  render() {
    const { videoUri } = this.props;

    return (
      <Mutation mutation={ADD_VIDEO_FILTERS}>
        {() => {
          return (
            <Formik
              initialValues={{
                positions: [],
                position: {
                  type: ''
                }
              }}
            >
              {({ values, handleChange }) => (
                <React.Fragment>
                  <VideoPlayer
                    formComponent={() => (
                      <form>
                        <Field name="position.type" />
                      </form>
                    )}
                    width="640"
                    onEdit={handleChange}
                    name="position"
                    value={values.position}
                    src={videoUri}
                    poster={`${videoUri}/1.png`}
                    editing
                  />

                  <Form>
                    <FieldArray name="positions">
                      {arrayHelpers => (
                        <div>
                          <h3>Below are the filterable listed events</h3>
                          {values.positions.map((position, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <div key={index}>
                              <Field name={`positions.${index}`}>
                                {({ field: { value }, form }) => (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      form.setFieldValue('position', value)
                                    }
                                  >
                                    <strong>{value.filterType}</strong>
                                    {` issue from ${secondsToHours(
                                      value.startTimeCode
                                    )} until ${secondsToHours(
                                      value.endTimeCode
                                    )}`}
                                  </button>
                                )}
                              </Field>
                              <button
                                type="button"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </FieldArray>
                  </Form>
                  <FormDebug />
                </React.Fragment>
              )}
            </Formik>
          );
        }}
      </Mutation>
    );
  }
}

VideoSecondStep.propTypes = {
  // videoId: PropTypes.string.isRequired,
  // nextStep: PropTypes.func.isRequired,
  // handleSubmit: PropTypes.func.isRequired,
  // previousStep: PropTypes.func.isRequired,
  videoUri: PropTypes.string.isRequired
};

export default VideoSecondStep;
