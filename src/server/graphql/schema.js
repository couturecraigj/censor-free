import { makeExecutableSchema, addMockFunctionsToSchema } from 'apollo-server';
import { ApolloServer } from 'apollo-server-express';
import { graphql, introspectionQuery } from 'graphql';
import fs from 'fs';
import typeDefs from './typeDefs';
import User from '../models/user';
import mocks from './mocks';
import resolvers from './resolvers';

const __DEV__ = process.env.NODE_ENV === 'development';

export default app => {
  const context = async ({ req, res, connection }) => {
    // authScope: getScope(req.headers.authorization)
    if (connection) {
      // check connection for metadata
      return {};
    }

    return {
      db: req.db,
      res,
      req
    };
  };
  let schema;

  if (__DEV__) {
    schema = makeExecutableSchema({
      typeDefs,
      resolvers,
      logger: {
        // eslint-disable-next-line no-console
        log: console.log
      },
      context,
      resolverValidationOptions: {
        requireResolversForResolveType: false
      }
    });
    graphql(schema, introspectionQuery).then(result => {
      const filteredData = result.data.__schema.types.filter(
        type => type.possibleTypes !== null
      );

      result.data.__schema.types = filteredData;
      app.set('fragments', result.data);

      fs.writeFileSync('fragmentTypes.json', JSON.stringify(result.data));
    });
    addMockFunctionsToSchema({ mocks, schema, preserveResolvers: true });
  }

  const server = new ApolloServer({
    schema: __DEV__ ? schema : undefined,
    typeDefs: __DEV__ ? undefined : typeDefs,
    resolvers: __DEV__ ? undefined : resolvers,
    playground: __DEV__
      ? {
          settings: {
            'general.betaUpdates': false,
            'editor.cursorShape': 'line',
            'editor.fontSize': 14,
            'editor.fontFamily':
              "'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace",
            'editor.theme': 'dark',
            'editor.reuseHeaders': true,
            'prettier.printWidth': 80,
            'request.credentials': 'include',
            'tracing.hideTracingResponse': true
          }
        }
      : false,
    context,
    subscriptions: {
      onConnect: async connectionParams => {
        if (connectionParams.authToken) {
          return User.getUserFromToken(connectionParams.authToken);
          // return validateToken(connectionParams.authToken)
          //   .then(findUser(connectionParams.authToken))
          //   .then(user => {
          //     return {
          //       currentUser: user,
          //     };
          //   });
        }

        throw new Error('Missing auth token!');
      }
    },
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

  server.applyMiddleware({
    app,
    cors: {
      origin(origin, callback) {
        if (['http://localhost:9080'].indexOf(origin) !== -1 || !origin) {
          callback(null, origin);
        } else {
          callback(null, true);
        }
      },
      credentials: true
    }
  });

  app.set('apollo', server);

  return server;
};
