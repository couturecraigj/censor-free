import express from 'express';
import fetch from 'node-fetch';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { getLoadableState } from 'loadable-components/server';
import { Helmet } from 'react-helmet';
import { ServerStyleSheet } from 'styled-components';
import { StaticRouter } from 'react-router-dom';
import apollo from '../common/apollo';
import initiateStore from '../common/redux';
import App from '../common/App';
import html from './html';
import routeCache from './routeCache';
import config from './config';
import setup from './setup';

const __PROD__ = process.env.NODE_ENV === 'production';

const app = express();

config(app);

app.use(function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  // console.log(req.url);
  // TODO: make it so Errors send everything to the Error Page
  res.status(500);
  if (__PROD__) {
    res.locals.errorMessage = 'Internal Server Error';
  } else {
    res.locals.errorMessage = `${err.message}\n${err.stack}`;
  }
  next();
});
app.get('*', async (req, res) => {
  try {
    // const csurfToken = req.csrfToken();
    const queryUrl = `${req.headers['x-forwarded-proto'] || req.protocol}://${
      req.headers.host
    }${app.get('apollo').graphqlPath}`;
    const store = initiateStore({
      errorMessage:
        res.locals.errorMessage ||
        (req.url === '/error' && 'Internal Server Error')
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
          <App store={store} />
        </ApolloProvider>
      </StaticRouter>
    );

    const preloadedState = store.getState();

    if (context.url) {
      return res.redirect(context.status, context.url);
    }
    return Promise.all([
      getLoadableState(spaApp),
      getDataFromTree(spaApp)
    ]).then(async ([loadableState]) => {
      const body = ReactDOMServer.renderToString(spaApp);
      const reactHelmet = Helmet.renderStatic();
      res.send(
        await routeCache.preCache(
          html({
            head: `<script>window.__STORE_STATE=${JSON.stringify(
              preloadedState
            )};window.__FRAGMENTS__=${JSON.stringify(
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
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    res.redirect('/error');
    // next(e);
  }
});

if (module === require.main) {
  app.listen(app.get('port'), () => {
    // eslint-disable-next-line no-console
    console.info(`server listening on http://localhost:${app.get('port')}`);
    setup(app);
  });
}

export default app;
