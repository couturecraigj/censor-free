import express from 'express';
import fetch from 'node-fetch';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { getLoadableState } from 'loadable-components/server';
import { Helmet } from 'react-helmet';
import { ServerStyleSheet } from 'styled-components';
import { StaticRouter } from 'react-router-dom';
// import { COOKIE_TYPE_MAP } from '../common/types';
import apollo from '../common/apollo';
import initiateStore from '../common/redux';
import App from '../common/App';
import html from './html';
import routeCache from './routeCache';
import config from './config';
import setup from './setup';

const __INTERNAL_QUERY_URI__ = process.env.INTERNAL_QUERY_URI;
const CLIENT_SERVER = process.env.CLIENT_SERVER;

const __PROD__ = process.env.NODE_ENV === 'production';

const app = express();

config(app);

app.use(function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  // eslint-disable-next-line no-console
  console.error(err);
  res.locals.status = 500;

  if (__PROD__) {
    res.locals.errorMessage = 'Internal Server Error';
  } else {
    res.locals.errorMessage = `${err.message}\n${err.stack}`;
  }

  next();
});
app.get('*', async (req, res) => {
  if (CLIENT_SERVER === 'server') return res.send('NOTHING HERE');

  try {
    // const csurfToken = req.csrfToken();
    const queryUrl = app.get('apollo').clientOnly
      ? app.get('apollo').graphqlUrl
      : `${req.headers['x-forwarded-proto'] || req.protocol}://${
          req.headers.host
        }${app.get('apollo').graphqlPath}`;
    const subscriptionUrl = app.get('apollo').clientOnly
      ? app.get('apollo').graphqlSubscriptionURL
      : `ws://${req.headers.host}${app.get('apollo').subscriptionsPath}`;
    // const loggedIn = req.user.id !== undefined;
    const loggedIn = false;
    const store = initiateStore({
      errorMessage:
        res.locals.errorMessage ||
        (req.url === '/error' && 'Internal Server Error'),
      loggedIn
    });

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
      cookie: req.headers.cookie
      // [COOKIE_TYPE_MAP.csurfToken]: csurf
    };

    const client = apollo(fetch, {
      headers,
      req,
      ssrMode: true,
      uri: __INTERNAL_QUERY_URI__ || queryUrl,
      fragments: app.get('fragments')
    });
    const spaApp = (
      <ApolloProvider client={client}>
        <StaticRouter location={req.url} context={context}>
          <App store={store} />
        </StaticRouter>
      </ApolloProvider>
    );

    const preloadedState = store.getState();

    return Promise.all([
      getLoadableState(spaApp),
      getDataFromTree(spaApp)
    ]).then(async ([loadableState]) => {
      const body = ReactDOMServer.renderToString(spaApp);
      const reactHelmet = Helmet.renderStatic();

      if (context.url) {
        if (context.status) return res.redirect(context.status, context.url);

        return res.redirect(context.url);
      }

      res.send(
        await routeCache.preCache(
          html({
            head: `<script>window.__STORE_STATE=${JSON.stringify(
              preloadedState
            )};window.__FRAGMENTS__=${JSON.stringify(
              app.get('fragments')
            )};window.QUERY_URL="${queryUrl}";window.SUBSCRIPTION_URL="${subscriptionUrl}";window.__APOLLO_STATE__=${JSON.stringify(
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
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    res.redirect('/error');
    // next(e);
  }
});

if (module === require.main) {
  const httpServer = require('http').createServer(app);

  app.get('apollo').installSubscriptionHandlers(httpServer);
  require('./ws')(httpServer, app);
  httpServer.listen(app.get('port'), () => {
    // eslint-disable-next-line no-console
    console.info(`server listening on http://localhost:${app.get('port')}`);
    setup(app);
  });
}

export default app;
