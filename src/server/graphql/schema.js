const { ApolloServer } = require("apollo-server-express");

const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");

module.exports = app => {
  const server = new ApolloServer({ typeDefs, resolvers });
  server.applyMiddleware({ app });
  app.set("apollo", server);
  return server;
};
