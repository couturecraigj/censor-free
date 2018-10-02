import { makeExecutableSchema, addMockFunctionsToSchema } from 'apollo-server';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './typeDefs';
import mocks from './mocks';
import resolvers from './resolvers';

const __DEV__ = process.env.NODE_ENV === 'development';
export default app => {
  let schema;
  if (__DEV__) {
    schema = makeExecutableSchema({
      typeDefs,
      resolvers,
      logger: {
        // eslint-disable-next-line no-console
        log: console.log
      },
      context: ({ req, res }) => ({
        // authScope: getScope(req.headers.authorization)
        db: req.db,
        res,
        req
      }),
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
    context: ({ req, res }) => ({
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
