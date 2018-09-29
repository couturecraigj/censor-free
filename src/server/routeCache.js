const __PROD__ = process.env.NODE_ENV;

const routeCache = {
  routes: ['/', '/about', '/login', '/sign-up'],
  cache: new Map(),
  hitCache(req, res, next) {
    if (__PROD__ && routeCache.cache.has(req.path)) {
      return res.send(routeCache.cache.get(req.path));
    }
    next();
  },
  preCache(string, route) {
    if (__PROD__ && routeCache.routes.includes(route)) {
      routeCache.cache.set(route, string);
    }
    return string;
  }
};
module.exports = routeCache;
