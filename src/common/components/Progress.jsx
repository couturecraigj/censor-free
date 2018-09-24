import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ProgressBar = styled.div`
  height: 3px;
  transition: all 0.2s;
  background-color: blue;
`;

const ProgressTotal = styled.div`
  width: 100%;
  height: 3px;
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
