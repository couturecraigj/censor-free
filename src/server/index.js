const React = require("react");
const express = require("express");
const { Helmet } = require("react-helmet");
const { ServerStyleSheet } = require("styled-components");
const html = require("./html");
const config = require("./config");
const app = express();
const ReactDOMServer = require("react-dom/server");
const App = require("../common/App").default;

app.use(express.static("public"));
config(app);
app.get("*", (req, res, next) => {
  const sheet = new ServerStyleSheet();
  const body = ReactDOMServer.renderToString(<App ssrMode req={req} />);
  const reactHelmet = Helmet.renderStatic();
  res.send(
    html({
      head: `${reactHelmet.title.toString()}${sheet.getStyleTags()}`,
      body,
      attrs: {
        body: reactHelmet.bodyAttributes.toString(),
        html: reactHelmet.htmlAttributes.toString()
      }
    })
  );
});

// app.listen(port, () => {
//   console.info(`server listening on http://localhost:${port}`);
// });

if (module === require.main) {
  app.listen(app.get("port"));
}

module.exports = app;
