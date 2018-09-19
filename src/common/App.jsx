import React from 'react';
import { Route, Switch } from 'react-router';
import { hot } from 'react-hot-loader';
import { Helmet } from 'react-helmet';
import styled, { injectGlobal } from 'styled-components';
import Layout from './components/Layout';
import * as Routes from './pages/Routes';

injectGlobal`
   html {
    background: papayawhip;
  }
`;

const Div = styled.div`
  height: 100%;
`;

const App = () => (
  <Div>
    <Helmet titleTemplate="MySite.com - %s">
      <title>Home</title>
    </Helmet>
    <Layout>
      <Switch>
        <Route exact path="/" component={Routes.Home} />
        <Route path="/about" component={Routes.About} />
        <Route path="/company/:id/:slug?" exact component={Routes.Company} />
        <Route path="/feed" component={Routes.Feed} />
        <Route path="/group/:id/:slug?" component={Routes.Group} />
        <Route path="/product/:id/:slug?" component={Routes.Product} />
        <Route path="/saved" component={Routes.Saved} />
        <Route path="/search" component={Routes.Search} />
        <Route path="/user/:id/:slug?" component={Routes.User} />
        <Route path="/video/:id/:slug?" component={Routes.Video} />
      </Switch>
    </Layout>
  </Div>
);

export default hot(module)(App);
