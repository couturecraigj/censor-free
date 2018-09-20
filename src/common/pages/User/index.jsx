import React from 'react';
import PropTypes from 'prop-types';
import loadable from 'loadable-components';
import { Route, Switch } from 'react-router';

import LoadingComponent from '../../components/Loader';
import User from './Single';

export const UserList = loadable(
  () => import(/* webpackChunkName: 'user-list' */ './List'),
  {
    LoadingComponent
  }
);

const Chooser = ({ match }) =>
  match.params.id === 'list' ? (
    <Switch>
      <Route exact path="/user/list" component={UserList} />
    </Switch>
  ) : (
    <User match={match} />
  );

Chooser.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired
};

Chooser.load = () => {
  UserList.load();
};

export default Chooser;
