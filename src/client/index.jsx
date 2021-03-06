import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { loadComponents } from 'loadable-components';
import { BrowserRouter } from 'react-router-dom';
import DB from '../utilities/db';
// import ErrorBoundary from '../common/components/ErrorBoundary';
import { COOKIE_TYPE_MAP } from '../common/types';
import App from '../common/App';
import apollo from '../common/apollo';
import initiateStore from '../common/redux';

// if (process.env.NODE_ENV !== 'production') {
//   // eslint-disable-next-line import/no-extraneous-dependencies
//   const { whyDidYouUpdate } = require('why-did-you-update');
//   whyDidYouUpdate(React);
// }

const rootElement = document.getElementById('root');

// import component from "../common";
async function render(ele) {
  await loadComponents();
  window.localForage = new DB();
  import(/* webpackChunkName: 'register-sw' */ './registerServiceWorker');
  const store = initiateStore(window.__STORE_STATE);

  window.localForage.setItem(COOKIE_TYPE_MAP.csurfToken, window.__CSURF__);
  const client = apollo(fetch, {
    uri: window.QUERY_URL,
    subscriptionUrl: window.SUBSCRIPTION_URL,
    state: window.__APOLLO_STATE__,
    fragments: window.__FRAGMENTS__
  });

  // component();
  ReactDOM.hydrate(
    <BrowserRouter>
      <ApolloProvider client={client}>
        {/* <ErrorBoundary> */}
        <App store={store} />
        {/* </ErrorBoundary> */}
      </ApolloProvider>
    </BrowserRouter>,
    ele
  );
}

render(rootElement);

if (module.hot) {
  // module.hot.accept('../common', function() {
  //   render(rootElement);
  // });
}
