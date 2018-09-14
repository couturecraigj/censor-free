const apolloSchemaSetup = require("../graphql/schema");
const port = 3000;

module.exports = app => {
  app.set("port", port);
  apolloSchemaSetup(app);
  return app;
};
