import React from "react";
import styled from "styled-components";
import { Route, Switch } from "react-router";
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

export default ({ client }) => (
  <Div>
    <Helmet>
      <title>Hello</title>
    </Helmet>
    <Route exact path="/" component={Routes.Home} />
  </Div>
);
