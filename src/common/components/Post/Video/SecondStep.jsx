import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { Formik, Form, Field, FieldArray } from 'formik';
import shaka from 'shaka-player';
import gql from 'graphql-tag';
import FormDebug from '../../FormDebug';

const filterInitialValues = {
  startTimeCode: '',
  endTimeCode: '',
  coordinates: {
    fromTop: '',
    fromLeft: ''
  }
};

const ADD_VIDEO_FILTERS = gql`
  mutation AddVideoFilters(
    $videoUri: String!
    $description: String!
    $title: String!
  ) {
    addVideoFilters(
      videoUri: $videoUri
      description: $description
      title: $title
    ) {
      id
      uri
    }
  }
`;

const renderArray = ({ label, key, values }) => arrayHelpers => (
  <div>
    <div>
      <label>{label}</label>
    </div>
    {values?.[key]?.length > 0 ? (
      <div>
        {values[key].map((sex, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index}>
            <Field
              name={`${key}.${index}.startTimeCode`}
              type="number"
              placeholder="Start Time"
            />
            <Field
              name={`${key}.${index}.endTimeCode`}
              type="number"
              placeholder="Stop Time"
            />
            <Field
              name={`${key}.${index}.coordinates.fromTop`}
              type="number"
              placeholder="Cooridinate From Top"
            />
            <Field
              name={`${key}.${index}.coordinates.fromLeft`}
              type="number"
              placeholder="Coordinate From Left"
            />
            <button type="button" onClick={() => arrayHelpers.remove(index)}>
              -
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => arrayHelpers.push(filterInitialValues)}
        >
          +
        </button>
      </div>
    ) : (
      <button
        type="button"
        onClick={() => arrayHelpers.push(filterInitialValues)}
      >
        +
      </button>
    )}
  </div>
);

class VideoSecondStep extends React.Component {
  video = React.createRef();
  componentDidMount() {
    shaka.polyfill.installAll();
    if (shaka.Player.isBrowserSupported()) {
      this.initPlayer();
    } else {
      // console.error('Browser not Supported');
    }
  }
  onErrorEvent = event => {
    // Extract the shaka.util.Error object from the event.
    this.onError(event.detail);
  };

  onError = () => {
    // Log the error.
    // console.error('Error code', error.code, 'object', error);
  };
  initPlayer = () => {
    const { videoUri } = this.props;
    const player = new shaka.Player(this.video.current);

    // Attach player to the window to make it easy to access in the JS console.
    window.player = player;

    // Listen for error events.
    player.addEventListener('error', this.onErrorEvent);
    const manifestUri = location.origin + videoUri + '.m3u8';
    //console.log(manifestUri);
    // Try to load a manifest.
    // This is an asynchronous process.
    player
      .load(manifestUri)
      .then(function() {
        // This runs if the asynchronous load is successful.
        // console.log('The video has now been loaded!');
      })
      .catch(this.onError); // onError is executed if the asynchronous load fails.
  };

  render() {
    const { videoId, previousStep, nextStep } = this.props;

    return (
      <Mutation mutation={ADD_VIDEO_FILTERS}>
        {addFilters => {
          return (
            <Formik
              initialValues={{
                id: videoId,
                sex: [],
                nudity: [],
                violence: [],
                weapons: [],
                frightening: [],
                gross: [],
                smoking: [],
                drugs: [],
                alcohol: [],
                language: []
              }}
              onSubmit={variables => {
                addFilters({ variables }).then(({ data }) => nextStep(data));
              }}
            >
              {({ values }) => (
                <Form>
                  <video ref={this.video}>
                    <track kind="captions" />
                  </video>
                  <FieldArray
                    name="sex"
                    render={renderArray({ label: 'Sex', key: 'sex', values })}
                  />
                  <FieldArray
                    name="nudity"
                    render={renderArray({
                      label: 'Nudity',
                      key: 'nudity',
                      values
                    })}
                  />
                  <FieldArray
                    name="violence"
                    render={renderArray({
                      label: 'Violence',
                      key: 'violence',
                      values
                    })}
                  />
                  <FieldArray
                    name="weapons"
                    render={renderArray({
                      label: 'Weapons',
                      key: 'weapons',
                      values
                    })}
                  />
                  <FieldArray
                    name="frightening"
                    render={renderArray({
                      label: 'Frightening',
                      key: 'frightening',
                      values
                    })}
                  />
                  <FieldArray
                    name="gross"
                    render={renderArray({
                      label: 'Gross',
                      key: 'gross',
                      values
                    })}
                  />
                  <FieldArray
                    name="smoking"
                    render={renderArray({
                      label: 'Smoking',
                      key: 'smoking',
                      values
                    })}
                  />
                  <FieldArray
                    name="drugs"
                    render={renderArray({
                      label: 'Drugs',
                      key: 'drugs',
                      values
                    })}
                  />
                  <FieldArray
                    name="alcohol"
                    render={renderArray({
                      label: 'Alcohol',
                      key: 'alcohol',
                      values
                    })}
                  />
                  <FieldArray
                    name="language"
                    render={renderArray({
                      label: 'Language',
                      key: 'language',
                      values
                    })}
                  />
                  <FormDebug />
                  <div>
                    <button type="button" onClick={previousStep}>
                      Cancel
                    </button>
                    <button type="submit">Submit</button>
                  </div>
                </Form>
              )}
            </Formik>
          );
        }}
      </Mutation>
    );
  }
}

VideoSecondStep.propTypes = {
  videoId: PropTypes.string.isRequired,
  videoUri: PropTypes.string.isRequired,
  nextStep: PropTypes.func.isRequired,
  previousStep: PropTypes.func.isRequired
};

export default VideoSecondStep;
