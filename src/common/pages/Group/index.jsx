import React from 'react';
import PropTypes from 'prop-types';
import Group from './Single';

const Chooser = ({ match }) => <Group match={match} />;

Chooser.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired
};

export default Chooser;
