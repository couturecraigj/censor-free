import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ProgressBar = styled.div`
  height: 10px;
  transition: all 0.4s;
  box-shadow: inset 0px 2px 5px rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  background-color: blue;
`;

const ProgressTotal = styled.div`
  width: 100%;
  box-shadow: inset 0px 0px 5px rgba(0, 0, 0, 0.5);
  height: 10px;
  border-radius: 10px;
  background-color: grey;
`;

const Progress = ({ progress }) => (
  <ProgressTotal>
    <ProgressBar progress={progress} style={{ width: `${progress}%` }} />
  </ProgressTotal>
);

Progress.propTypes = {
  progress: PropTypes.number.isRequired
};

export default Progress;
