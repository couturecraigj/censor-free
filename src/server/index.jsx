const express = require('express');
const fetch = require('node-fetch');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { ApolloProvider, getDataFromTree } = require('react-apollo');
const { getLoadableState } = require('loadable-components/server');
const { Helmet } = require('react-helmet');
const { ServerStyleSheet } = require('styled-components');
const { StaticRouter } = require('react-router-dom');

const apollo = require('../common/apollo').default;
const App = require('../common/App').default;
const config = require('./config');
const html = require('./html');
const routeCache = require('./routeCache');
const setup = require('./setup');

const app = express();

config(app);
app.get('*', async (req, res, next) => {
  try {
    // const csurfToken = req.csrfToken();
    const queryUrl = app.get('url') + app.get('apollo').graphqlPath;
    // eslint-disable-next-line prefer-const
    let context = {};
    // const [csurf, cookie] = await fetch(
    //   `http://localhost:${app.get('port')}/csurf`
    // ).then(async result => [
    //   await result.json(),
    //   result.headers.get('set-cookie')
    // ]);

    const sheet = new ServerStyleSheet();
    const headers = {
      // cookie,
      // 'x-xsurf-token': csurf
    };
    const client = apollo(fetch, {
      headers,
      req,
      ssrMode: true,
      uri: queryUrl,
      fragments: app.get('fragments')
    });

    const spaApp = (
      <StaticRouter location={req.url} context={context}>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </StaticRouter>
    );
    if (context.url) {
      return res.redirect(context.status, context.url);
    }
    return Promise.all([getLoadableState(spaApp), getDataFromTree(spaApp)])
      .then(([loadableState]) => {
        const body = ReactDOMServer.renderToString(spaApp);
        const reactHelmet = Helmet.renderStatic();
        res.send(
          routeCache.preCache(
            html({
              head: `<script>window.__FRAGMENTS__=${JSON.stringify(
                app.get('fragments')
              )};window.QUERY_URL="${queryUrl}";window.__APOLLO_STATE__=${JSON.stringify(
                client.extract()
              )};</script>${loadableState.getScriptTag()}${reactHelmet.title.toString()}${sheet.getStyleTags()}`,
              body,
              attrs: {
                body: reactHelmet.bodyAttributes.toString(),
                html: reactHelmet.htmlAttributes.toString()
              }
            }),
            req.path
          )
        );
      })
      .catch(err => next(err));
  } catch (e) {
    next(e);
  }
});
app.use(function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.send(`${err.message}\n${err.stack}`);
});
if (module === require.main) {
  app.listen(app.get('port'), () => {
    // eslint-disable-next-line no-console
    console.info(`server listening on http://localhost:${app.get('port')}`);
    setup(app);
  });
}

module.exports = app;
