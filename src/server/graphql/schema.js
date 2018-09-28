const {
  makeExecutableSchema,
  addMockFunctionsToSchema
} = require('apollo-server');
const { ApolloServer } = require('apollo-server-express');

const mocks = require('./mocks');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

const __DEV__ = process.env.NODE_ENV === 'development';
module.exports = app => {
  let schema;
  if (__DEV__) {
    schema = makeExecutableSchema({
      typeDefs,
      resolvers,
      logger: {
        // eslint-disable-next-line no-console
        log: console.log
      },
      resolverValidationOptions: {
        requireResolversForResolveType: false
      }
    });
    addMockFunctionsToSchema({ mocks, schema, preserveResolvers: true });
  }
  const server = new ApolloServer({
    schema: __DEV__ ? schema : undefined,
    typeDefs: __DEV__ ? undefined : typeDefs,
    resolvers: __DEV__ ? undefined : resolvers,
    context: ({ req, res }) => ({
      // authScope: getScope(req.headers.authorization)
      db: req.db,
      res,
      req
    }),
    tracing: true,
    cacheControl: true,
    formatError: error => {
      // eslint-disable-next-line no-console
      console.log(error);
      throw new Error('Internal server error');
    },
    // formatResponse: response => {
    //   // eslint-disable-next-line no-console
    //   console.log(response);
    //   return response;
    // },

    debug: true
  });
  server.applyMiddleware({ app });
  app.set('apollo', server);
  return server;
};
