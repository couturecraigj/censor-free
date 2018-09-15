const React = require("react");
const express = require("express");
const { Helmet } = require("react-helmet");
const { StaticRouter } = require("react-router-dom");
const { getLoadableState } = require("loadable-components/server");
const { ServerStyleSheet } = require("styled-components");
const html = require("./html");
const config = require("./config");
const fetch = require("node-fetch");
const app = express();
const ReactDOMServer = require("react-dom/server");
const App = require("../common/App").default;
const apollo = require("../common/apollo").default;

app.use(express.static("public"));
config(app);
app.get("*", (req, res, next) => {
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

// app.listen(port, () => {
//   console.info(`server listening on http://localhost:${port}`);
// });

if (module === require.main) {
  app.listen(app.get("port"));
}

module.exports = app;
