import React from 'react';
import PropTypes from 'prop-types';
import User from './Single';

const Chooser = ({ match }) => <User match={match} />;

Chooser.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired
};

export default Chooser;
