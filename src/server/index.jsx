const express = require('express');
const fetch = require('node-fetch');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { getLoadableState } = require('loadable-components/server');
const { Helmet } = require('react-helmet');
const { ServerStyleSheet } = require('styled-components');
const { StaticRouter } = require('react-router-dom');

const apollo = require('../common/apollo').default;
const App = require('../common/App').default;
const config = require('./config');
const html = require('./html');

const app = express();
app.use(express.static('public'));
config(app);
app.get('*', (req, res, next) => {
  // eslint-disable-next-line prefer-const
  let context = {};
  const sheet = new ServerStyleSheet();
  const client = apollo(fetch, { req, ssrMode: true });
  const spaApp = (
    <StaticRouter location={req.url} context={context}>
      <App client={client} />
    </StaticRouter>
  );
  return getLoadableState(spaApp)
    .then(loadableState => {
      const body = ReactDOMServer.renderToString(spaApp);
      const reactHelmet = Helmet.renderStatic();
      res.send(
        html({
          head: `${loadableState.getScriptTag()}${reactHelmet.title.toString()}${sheet.getStyleTags()}`,
          body,
          attrs: {
            body: reactHelmet.bodyAttributes.toString(),
            html: reactHelmet.htmlAttributes.toString()
          }
        })
      );
    })
    .catch(err => next(err));
});

if (module === require.main) {
  app.listen(app.get('port'), () => {
    // eslint-disable-next-line no-console
    console.info(`server listening on http://localhost:${app.get('port')}`);
  });
}

module.exports = app;
