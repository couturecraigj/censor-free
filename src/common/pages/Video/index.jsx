import React from 'react';
import PropTypes from 'prop-types';
import loadable from 'loadable-components';
import { Route, Switch } from 'react-router';

import LoadingComponent from '../../components/Loader';
import Video from './Single';

export const VideoList = loadable(
  () => import(/* webpackChunkName: 'video-list' */ './List'),
  {
    LoadingComponent
  }
);

const Chooser = ({ match }) =>
  match.params.id === 'list' ? (
    <Switch>
      <Route exact path="/video/list" component={VideoList} />
    </Switch>
  ) : (
    <Video />
  );

Chooser.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired
};

Chooser.load = () => {
  VideoList.load();
};

export default Chooser;
