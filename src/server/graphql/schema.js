const { ApolloServer, gql } = require("apollo-server-express");

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

module.exports = app => {
  const server = new ApolloServer({ typeDefs, resolvers });
  server.applyMiddleware({ app });
  app.set("apollo", server);
  return server;
};
