import React from "react";
import styled from "styled-components";
import { Route, Switch } from "react-router";
import { hot } from "react-hot-loader";
import { Helmet } from "react-helmet";
import * as Routes from "./pages/Routes";
import { injectGlobal } from "styled-components";

const GlobalStyle = injectGlobal`
   html {
    background: papayawhip;
  }
`;

const Div = styled.div`
  height: 100%;
`;

const App = ({ client }) => (
  <Div>
    <Helmet>
      <title>Hello</title>
    </Helmet>
    <Switch>
      <Route exact path="/" component={Routes.Home} />
      <Route path="/about" component={Routes.About} />
      <Route path="/user/:userId" component={Routes.User} />
    </Switch>
  </Div>
);

export default hot(module)(App);
