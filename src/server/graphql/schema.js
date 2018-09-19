const { ApolloServer } = require('apollo-server-express');

const mocks = require('./mocks');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

module.exports = app => {
  const server = new ApolloServer({ typeDefs, resolvers, mocks });
  server.applyMiddleware({ app });
  app.set('apollo', server);
  return server;
};
