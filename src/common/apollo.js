import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { withClientState } from "apollo-link-state";
import { ApolloLink, Observable } from "apollo-link";

export default (state = {}, uri, ssrMode = false, req = null) => {
  // const cache = new InMemoryCache({
  //   cacheRedirects: {
  //     Query: {
  //       movie: (_, { id }, { getCacheKey }) =>
  //         getCacheKey({ __typename: 'Movie', id });
  //     }
  //   }
  // });

  const cache = new InMemoryCache();

  const request = async operation => {
    const token = await AsyncStorage.getItem("token");
    operation.setContext({
      headers: {
        authorization: token
      }
    });
  };

  const requestLink = new ApolloLink(
    (operation, forward) =>
      new Observable(observer => {
        let handle;
        Promise.resolve(operation)
          .then(oper => request(oper))
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer)
            });
          })
          .catch(observer.error.bind(observer));

        return () => {
          if (handle) handle.unsubscribe();
        };
      })
  );

  const client = new ApolloClient({
    ssrMode,
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          sendToLoggingService(graphQLErrors);
        }
        if (networkError) {
          logoutUser();
        }
      }),
      requestLink,
      withClientState({
        defaults: {
          isConnected: true
        },
        resolvers: {
          Mutation: {
            updateNetworkStatus: (_, { isConnected }, { cache }) => {
              cache.writeData({ data: { isConnected } });
              return null;
            }
          }
        },
        cache
      }),
      new HttpLink({
        uri,
        fetch: ssrMode ? require("node-fetch") : fetch,
        credentials: "same-origin",
        headers: req
          ? {
              cookie: req.header("Cookie")
            }
          : undefined
      })
    ]),
    cache: ssrMode ? cache : cache.restore(state),
    ssrForceFetchDelay: ssrMode ? 100 : undefined
  });
  return client;
};
