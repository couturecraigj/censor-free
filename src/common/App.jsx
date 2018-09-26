import React from 'react';
import { Route, Switch } from 'react-router';
import { hot } from 'react-hot-loader';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import Layout from './components/Layout';
import * as Routes from './pages/Routes';

const siteName = 'CoutureCraig.com';

const Div = styled.div`
  height: 100%;
`;

const App = () => (
  <Div>
    <Helmet titleTemplate={`${siteName} - %s`}>
      <title> Home </title>
    </Helmet>
    <Layout>
      <Switch>
        <Route exact path="/" component={Routes.Home} />
        <Route exact path="/login" component={Routes.Login} />
        <Route exact path="/sign-up" component={Routes.SignUp} />
        <Route exact path="/account/profile" component={Routes.Profile} />
        <Route
          exact
          path="/account/forgot-password"
          component={Routes.ForgotPassword}
        />
        <Route
          exact
          path="/account/reset-password/:token"
          component={Routes.Reset}
        />
        <Route path="/about" component={Routes.About} />
        <Route path="/company/list" exact component={Routes.CompanyList} />
        <Route path="/company/:id/:slug?" component={Routes.Company} />
        <Route path="/feed" component={Routes.Feed} />
        <Route path="/group/list" exact component={Routes.GroupList} />
        <Route path="/group/:id/:slug?" component={Routes.Group} />
        <Route path="/product/list" exact component={Routes.ProductList} />
        <Route path="/product/:id/:slug?" component={Routes.Product} />
        <Route path="/saved" component={Routes.Saved} />
        <Route path="/search" component={Routes.Search} />
        <Route path="/user/list" exact component={Routes.UserList} />
        <Route path="/user/:id/:slug?" component={Routes.User} />
        <Route path="/video/list" exact component={Routes.VideoList} />
        <Route path="/video/:id/:slug?" component={Routes.Video} />
      </Switch>
    </Layout>
  </Div>
);

export default hot(module)(App);
