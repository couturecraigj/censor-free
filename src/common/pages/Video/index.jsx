import React from 'react';
import PropTypes from 'prop-types';
import Video from './Single';

const Chooser = ({ match }) => <Video match={match} />;

Chooser.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired
};

export default Chooser;
