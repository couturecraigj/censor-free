/* global __ASSETS__, __webpack_hash__, __SW_PREFIX__ */
const staticCacheName = 'static-' + __webpack_hash__;
const swPrefix = __SW_PREFIX__;
// const dynamicGetCacheName = 'dynamic-get-' + __webpack_hash__;
// const dynamicPostCacheName = 'dynamic-post-' + __webpack_hash__;
const cachedFiles = __ASSETS__ || [];
// self.addEventListener('fetch', event => {
//   event.waitUntil();
// });

self.addEventListener('install', function(event) {
  // eslint-disable-next-line no-console
  console.log(swPrefix + 'Installing');
  event.waitUntil(
    (async () => {
      const cache = await caches.open(staticCacheName);
      return cache.addAll(cachedFiles);
    })()
  );
});

self.addEventListener('fetch', function(event) {
  // eslint-disable-next-line no-console
  console.log(swPrefix + 'Fetching');
  event.respondWith(
    (async () => {
      const response = await caches.match(event.request);
      return response || fetch(event.request);
    })()
  );
});
