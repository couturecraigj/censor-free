const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');

const mocks = require('./mocks');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

module.exports = app => {
  const server = new ApolloServer({
    // typeDefs,
    // resolvers,
    schema: makeExecutableSchema({
      typeDefs,
      resolvers,
      mocks,
      logger: {
        // eslint-disable-next-line no-console
        log: console.log
      },
      resolverValidationOptions: {
        requireResolversForResolveType: false
      }
    }),
    context: ({ req, res }) => ({
      // authScope: getScope(req.headers.authorization)
      db: req.db,
      res,
      req
    }),
    formatError: error => {
      // eslint-disable-next-line no-console
      console.log(error);
      return new Error('Internal server error');
    },
    formatResponse: response => {
      // eslint-disable-next-line no-console
      console.log(response);
      return response;
    },
    mocks
    // debug: true
  });
  server.applyMiddleware({ app });
  app.set('apollo', server);
  return server;
};
