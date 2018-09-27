import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo';
import { loadComponents } from 'loadable-components';
import { BrowserRouter } from 'react-router-dom';
import App from '../common/App';
import apollo from '../common/apollo';

const rootElement = document.getElementById('root');
// import component from "../common";
async function render(ele) {
  await loadComponents();
  localStorage.setItem('csurf-token', window.__CSURF__);
  const client = apollo(fetch, {
    uri: window.QUERY_URL,
    state: window.__APOLLO_STATE__,
    fragments: window.__FRAGMENTS__
  });
  // component();
  ReactDOM.hydrate(
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>,
    ele
  );
}

render(rootElement);

if (module.hot) {
  module.hot.accept('../common', function() {
    render(rootElement);
  });
}
