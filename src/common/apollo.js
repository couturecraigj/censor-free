import { ApolloClient } from 'apollo-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';
import { WebSocketLink } from 'apollo-link-ws';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
// import { withClientState } from "apollo-link-state";
import { ApolloLink, split } from 'apollo-link';
import { COOKIE_TYPE_MAP } from './types';

export default (
  fetch,
  {
    state = {},
    uri = '/',
    ssrMode = false,
    subscriptionUrl,
    headers,
    fragments: introspectionQueryResultData
  } = {}
) => {
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData
  });

  const link = ApolloLink.from(
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
      }),
      !ssrMode &&
        setContext((_, { headers }) => {
          const token = localStorage.getItem(COOKIE_TYPE_MAP.token);
          const csurfToken = localStorage.getItem(COOKIE_TYPE_MAP.csurfToken);
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
        headers: ssrMode
          ? {
              ...headers
            }
          : undefined
      })
    ].filter(v => v)
  );

  const cache = new InMemoryCache({ fragmentMatcher });
  const client = new ApolloClient({
    ssrMode,
    link: ssrMode
      ? link
      : split(
          ({ query }) => {
            const { kind, operation } = getMainDefinition(query);
            return (
              kind === 'OperationDefinition' && operation === 'subscription'
            );
          },
          new WebSocketLink({
            uri: subscriptionUrl,
            options: {
              reconnect: true,
              connectionParams: () => ({
                authToken: localStorage.getItem(COOKIE_TYPE_MAP.token)
              })
            }
          }),
          // link,

          link
        ),
    cache: ssrMode ? cache : cache.restore(state),
    ssrForceFetchDelay: ssrMode ? 100 : undefined
  });
  return client;
};
