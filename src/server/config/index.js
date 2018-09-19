const apolloSchemaSetup = require('../graphql/schema');

const port = 3000;

module.exports = app => {
  app.set('port', port);
  app.set('url', 'http://localhost:3000');

  apolloSchemaSetup(app);
  return app;
};
