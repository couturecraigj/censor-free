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
  const client = apollo(fetch, {});
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
    // eslint-disable-next-line
    console.log('Accepting the updated printMe module!');
    render(rootElement);
  });
}
