import React from "react";
import ReactDOM from "react-dom";
import { hot } from "react-hot-loader";
import { ApolloProvider } from "react-apollo";
import App from "../common/App";
import { loadComponents } from "loadable-components";
import { BrowserRouter } from "react-router-dom";
import apollo from "../common/apollo";
const root = document.getElementById("root");
// console.log(root);
import component from "../common";
function load() {
  return loadComponents().then(() => {
    const client = apollo(fetch, {});
    component();
    ReactDOM.hydrate(
      <BrowserRouter>
        <ApolloProvide client={client}>
          <App />
        </ApolloProvide>
      </BrowserRouter>,
      root
    );
  });
}

hot(module)(App);
load();

if (module.hot) {
  module.hot.accept("../common", function() {
    console.log("Accepting the updated printMe module!");
    load();
  });
}
