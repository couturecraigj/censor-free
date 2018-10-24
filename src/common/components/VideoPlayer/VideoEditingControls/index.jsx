import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Field, Formik, Form } from 'formik';
import { FILTER_TYPE_MAP } from '../../../types';
import Canvas from './Canvas';

const initialValues = {
  position: { startTimeCode: 0, type: '', endTimeCode: 0 }
};

const RangeSlider = styled.input.attrs({
  type: 'range'
})`
  z-index: 6;
  width: 100%;
`;
const EditContainer = styled.div`
  display: block;
  z-index: 10;
  padding: 0.6em 0.3em;
  border: solid #eee 1px;
  background-color: #ddd;
  left: 0;
  right: 0;
  position: absolute;
`;
const SliderGroup = styled.div`
  margin: 0 10px;
`;
const EditRelative = styled.div`
  display: block;
  display: flex;
  z-index: 6;
  position: relative;
`;
const Buttons = styled.div`
  display: block;
  display: flex;
  z-index: 6;
  position: relative;
`;

class VideoEditingControls extends React.Component {
  componentDidMount() {
    this.replacePoster();
  }

  onSubmit = (values, { resetForm }) => {
    resetForm();
  };
  onReset = (values, { resetForm }) => {
    resetForm();
  };
  replacePoster = () => {
    const { changeTime } = this.props;
    setTimeout(() => {
      changeTime(0.1);
      setTimeout(() => {
        changeTime(0);
      }, 10);
    }, 500);
  };

  changeTime = (field, values) => {
    const innerChange = e => {
      const { changeTime } = this.props;
      const { value } = e.target;

      // onChange({ target: { name, value: +value } });
      changeTime(value);

      if (typeof field.onChange === 'function') {
        if (
          field.name.includes('startTime') &&
          +e.target.value > values.position.endTimeCode
        )
          field.onChange({
            target: { name: 'position.endTimeCode', value: e.target.value }
          });
        field.onChange(e);
      }
    };
    if (typeof field.onChange === 'function') return innerChange;
    return innerChange(field);
  };

  render() {
    const { currentTime, duration, width, height } = this.props;
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={this.onSubmit}
        onReset={this.onReset}
      >
        {({ values, handleReset }) => (
          <React.Fragment>
            <Field name="position">
              {({ field }) => (
                <Canvas
                  {...field}
                  width={width}
                  height={height}
                  currentTime={currentTime}
                />
              )}
            </Field>
            <Form>
              <EditContainer>
                <EditRelative>
                  <Field name="position.type">
                    {({ field }) => (
                      <select {...field}>
                        <option value="" disabled>
                          -- None --
                        </option>
                        {Object.entries(FILTER_TYPE_MAP).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                  <SliderGroup>
                    <label>
                      {`Start Time ${
                        values.position.startTimeCode
                      }/${duration}`}
                      <Field name="position.startTimeCode">
                        {({ field }) => (
                          <RangeSlider
                            {...field}
                            max={duration}
                            min={0}
                            step={0.1}
                            onChange={this.changeTime(field, values)}
                          />
                        )}
                      </Field>
                    </label>
                    <label>
                      {`End Time ${values.position.endTimeCode}/${duration}`}
                      <Field name="position.endTimeCode">
                        {({ field }) => (
                          <RangeSlider
                            {...field}
                            max={duration}
                            min={values.position.startTimeCode}
                            step={0.1}
                            onChange={this.changeTime(field)}
                          />
                        )}
                      </Field>
                    </label>
                  </SliderGroup>
                  <Buttons>
                    <button type="submit">Submit</button>
                    <button type="button" onClick={handleReset}>
                      Cancel
                    </button>
                  </Buttons>
                </EditRelative>
              </EditContainer>
            </Form>
          </React.Fragment>
        )}
      </Formik>
    );
  }
}

VideoEditingControls.propTypes = {
  // video: PropTypes.shape({
  //   current: PropTypes.object
  // }).isRequired,
  value: PropTypes.shape({
    startTimeCode: PropTypes.number,
    endTimeCode: PropTypes.number,
    height: PropTypes.number
  }),
  onSubmit: PropTypes.func,
  changeTime: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  currentTime: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired
};

VideoEditingControls.defaultProps = {
  value: {},
  onChange: () => {},
  onSubmit: () => {}
};

export default VideoEditingControls;
