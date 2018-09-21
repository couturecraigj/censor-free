import React from 'react';
import PropTypes from 'prop-types';
import Company from './Single';

const Chooser = ({ match }) => <Company match={match} />;

Chooser.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired
};

export default Chooser;
