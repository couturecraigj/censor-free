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
    mocks,
    debug: true
  });
  server.applyMiddleware({ app });
  app.set('apollo', server);
  return server;
};
