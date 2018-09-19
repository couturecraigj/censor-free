import React from 'react';
import PropTypes from 'prop-types';
import loadable from 'loadable-components';
import { Route, Switch } from 'react-router';

import LoadingComponent from '../../components/Loader';
import Product from './Single';

export const ProductList = loadable(
  () => import(/* webpackChunkName: 'product-list' */ './List'),
  {
    LoadingComponent
  }
);

const Chooser = ({ match }) =>
  match.params.id === 'list' ? (
    <Switch>
      <Route exact path="/product/list" component={ProductList} />
    </Switch>
  ) : (
    <Product />
  );

Chooser.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired
};

Chooser.load = () => {
  ProductList.load();
};

export default Chooser;
