import { ApolloClient } from 'apollo-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
// import { onError } from "apollo-link-error";
// import { withClientState } from "apollo-link-state";
import { ApolloLink } from 'apollo-link';

export default (
  fetch,
  {
    state = {},
    uri = '/',
    ssrMode = false,
    // req,
    fragments: introspectionQueryResultData
  } = {}
) => {
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData
  });
  const cache = new InMemoryCache({ fragmentMatcher });

  const client = new ApolloClient({
    ssrMode,
    link: ApolloLink.from(
      [
        !ssrMode &&
          setContext((_, { headers }) => {
            const token = localStorage.getItem('token');
            return {
              headers: {
                ...headers,
                'Access-Control-Allow-Credentials': true,
                authorization: token ? `Bearer ${token}` : ''
              }
            };
          }),
        new HttpLink({
          uri,
          fetch,
          credentials: 'same-origin'
          // headers: req
          //   ? {
          //       cookie: req.header('Cookie')
          //     }
          //   : undefined
        })
      ].filter(v => v)
    ),
    cache: ssrMode ? cache : cache.restore(state),
    ssrForceFetchDelay: ssrMode ? 100 : undefined
  });
  return client;
};
