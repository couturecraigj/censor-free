import { ApolloClient } from 'apollo-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
// import { withClientState } from "apollo-link-state";
import { ApolloLink } from 'apollo-link';

export default (
  fetch,
  {
    state = {},
    uri = '/',
    ssrMode = false,
    headers,
    req,
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
        onError(({ graphQLErrors, networkError }) => {
          if (graphQLErrors)
            graphQLErrors.map(({ message, locations, path }) =>
              // eslint-disable-next-line no-console
              console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
              )
            );
          if (networkError)
            // eslint-disable-next-line no-console
            console.log(`[Network error]: ${networkError.stack}`);
          // // eslint-disable-next-line no-console
          // console.log(networkError);
          // // eslint-disable-next-line no-console
          // console.log(headers);
        }),
        !ssrMode &&
          setContext((_, { headers }) => {
            const token = localStorage.getItem('token');
            const csurfToken = localStorage.getItem('csurf-token');
            return {
              headers: {
                ...headers,
                'Access-Control-Allow-Credentials': true,
                authorization: token ? `Bearer ${token}` : '',
                'x-xsrf-token': csurfToken
              }
            };
          }),
        new HttpLink({
          uri,
          fetch,
          credentials: 'same-origin',
          headers: req
            ? {
                cookie: [headers.cookie].filter(v => v).join(';'),
                ...headers
              }
            : undefined
        })
      ].filter(v => v)
    ),
    cache: ssrMode ? cache : cache.restore(state),
    ssrForceFetchDelay: ssrMode ? 100 : undefined
  });
  return client;
};
