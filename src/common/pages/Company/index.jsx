import React from 'react';
import PropTypes from 'prop-types';
import loadable from 'loadable-components';
import { Route, Switch } from 'react-router';

import LoadingComponent from '../../components/Loader';
import Company from './Single';

export const CompanyList = loadable(
  () => import(/* webpackChunkName: 'company-list' */ './List'),
  {
    LoadingComponent
  }
);

const Chooser = ({ match }) =>
  match.params.id === 'list' ? (
    <Switch>
      <Route exact path="/company/list" component={CompanyList} />
    </Switch>
  ) : (
    <Company />
  );

Chooser.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired
};

Chooser.load = () => {
  CompanyList.load();
};

export default Chooser;
