import React from "react";
// import { ApolloProvider } from "react-apollo";
import client from "./apollo";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { injectGlobal } from "styled-components";

const GlobalStyle = injectGlobal`
   html {
    background: papayawhip;
  }
`;

const Div = styled.div`
  height: 100%;
`;

export default ({ state, uri, ssrMode, req }) => (
  <Div>
    <Helmet>
      <title>Hello</title>
    </Helmet>
    Hello
  </Div>
);
