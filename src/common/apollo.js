import { ApolloClient } from 'apollo-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from 'apollo-cache-inmemory';
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
    link: ApolloLink.from([
      new HttpLink({
        uri,
        fetch,
        credentials: 'same-origin',
        headers: req
          ? {
              cookie: req.header('Cookie')
            }
          : undefined
      })
    ]),
    cache: ssrMode ? cache : cache.restore(state),
    ssrForceFetchDelay: ssrMode ? 100 : undefined
  });
  return client;
};
