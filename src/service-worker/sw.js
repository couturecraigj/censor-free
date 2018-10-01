/* global __ASSETS__, __webpack_hash__, __SW_PREFIX__, clients */
// const DataBase = require('./db').default;

const staticCacheName = 'static-' + __webpack_hash__;
const swPrefix = __SW_PREFIX__ || '';
// const dynamicGetCacheName = 'dynamic-get-' + __webpack_hash__;
// const dynamicPostCacheName = 'dynamic-post-' + __webpack_hash__;
const cachedFiles = __ASSETS__ || [];
// const graphqlPostDB = new DataBase('graphql', 'post');
self.addEventListener('install', function(event) {
  // eslint-disable-next-line no-console
  console.log(swPrefix + 'Installing');
  // eslint-disable-next-line no-console
  console.log(swPrefix + 'Installing');
  event.waitUntil(
    (async () => {
      await caches.keys().then(cacheNames => {
        return cacheNames.forEach(cacheName => {
          return caches.delete(cacheName);
        });
      });
      const cache = await caches.open(staticCacheName);
      await cache.addAll(cachedFiles);
    })()
  );
  self.skipWaiting();
});

self.addEventListener('activated', async function(event) {
  // eslint-disable-next-line no-console
  console.log(swPrefix + 'Installing');
  try {
    await event.waitUntil(clients.claim());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
});

self.addEventListener('fetch', function(event) {
  // eslint-disable-next-line no-console
  console.log(swPrefix + 'Fetching');
  if (
    event.request.url.includes('sockjs-node/info') ||
    ['POST', 'PUT', 'PATCH'].includes(event.request.method)
  ) {
    // eslint-disable-next-line no-console
    console.log('Skipping Checks');
    return;
  }
  event.respondWith(
    (async () => {
      try {
        const response = await caches.match(event.request.clone());
        caches.open(staticCacheName).then(async cache => {
          const finalResponse = await fetch(event.request.clone());
          const contentType = finalResponse.headers.get('Content-Type') || '';
          const html =
            event.request.url.endsWith('.html') ||
            contentType.match(/(html)/gi);
          const js =
            event.request.url.endsWith('.js') ||
            contentType.match(/(javascript)/gi);
          const json =
            event.request.url.endsWith('.json') ||
            contentType.match(/(json)/gi);
          if (html || json || js)
            return cache.put(event.request.clone(), finalResponse);
        });
        return response || fetch(event.request.clone());
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })()
  );
});
