const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');

const mocks = require('./mocks');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

const __DEV__ = process.env.NODE_ENV === 'development';
module.exports = app => {
  const server = new ApolloServer({
    // typeDefs,
    resolvers,
    schema: makeExecutableSchema({
      typeDefs,
      resolvers,

      // logger: {
      //   // eslint-disable-next-line no-console
      //   log: console.log
      // },
      mocks: __DEV__ ? mocks : false,
      resolverValidationOptions: {
        requireResolversForResolveType: false
      },
      mockEntireSchema: false
    }),
    context: ({ req, res }) => ({
      // authScope: getScope(req.headers.authorization)
      db: req.db,
      res,
      req
    })
    // formatError: error => {
    //   // eslint-disable-next-line no-console
    //   console.log(error);
    //   return new Error('Internal server error');
    // },
    // formatResponse: response => {
    //   // eslint-disable-next-line no-console
    //   console.log(response);
    //   return response;
    // },

    // debug: true
  });
  server.applyMiddleware({ app });
  app.set('apollo', server);
  return server;
};
