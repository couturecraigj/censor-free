import React from 'react';
import PropTypes from 'prop-types';
import loadable from 'loadable-components';
import { Route, Switch } from 'react-router';

import LoadingComponent from '../../components/Loader';
import Group from './Single';

export const GroupList = loadable(
  () => import(/* webpackChunkName: 'group-list' */ './List'),
  {
    LoadingComponent
  }
);

const Chooser = ({ match }) =>
  match.params.id === 'list' ? (
    <Switch>
      <Route exact path="/group/list" component={GroupList} />
    </Switch>
  ) : (
    <Group match={match} />
  );

Chooser.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired
};

Chooser.load = () => {
  GroupList.load();
};

export default Chooser;
