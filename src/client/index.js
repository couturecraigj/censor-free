import React from "react";
import ReactDOM from "react-dom";
import { hot } from "react-hot-loader";
import App from "../common/App";
const root = document.getElementById("root");
// console.log(root);

import component from "../common";
function load() {
  component();
  ReactDOM.hydrate(<App state={{}} />, root);
}

hot(module)(App);
load();

if (module.hot) {
  module.hot.accept("../common", function() {
    console.log("Accepting the updated printMe module!");
    load();
  });
}
