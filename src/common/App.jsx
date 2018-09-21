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
    font-family: arial;
  }
  body {
    margin: 0;
  }
`;

/*
Can Bluehost be just the domain
*/

const Div = styled.div`
  height: 100%;
`;

const App = () => (
  <Div>
    <Helmet titleTemplate="MySite.com - %s">
      <title> Home </title>
    </Helmet>
    <Layout>
      <Switch>
        <Route exact path="/" component={Routes.Home} />
        <Route path="/about" component={Routes.About} />
        <Route path="/company/list" exact component={Routes.Company.List} />
        <Route path="/company/:id/:slug?" component={Routes.Company} />
        <Route path="/feed" component={Routes.Feed} />
        <Route path="/group/list" exact component={Routes.Group.List} />
        <Route path="/group/:id/:slug?" component={Routes.Group} />
        <Route path="/product/list" exact component={Routes.Product.List} />
        <Route path="/product/:id/:slug?" component={Routes.Product} />
        <Route path="/saved" component={Routes.Saved} />
        <Route path="/search" component={Routes.Search} />
        <Route path="/user/list" exact component={Routes.User.List} />
        <Route path="/user/:id/:slug?" component={Routes.User} />
        <Route path="/video/list" exact component={Routes.Video.List} />
        <Route path="/video/:id/:slug?" component={Routes.Video} />
      </Switch>
    </Layout>
  </Div>
);

export default hot(module)(App);
