import fs from 'fs';
import path from 'path';

import { makeDirectory } from './utils/fileSystem';

const __PROD__ = process.env.NODE_ENV === 'production';

const routeCache = {
  routes: ['/', '/about', '/login', '/sign-up'],
  cache: new Map(),
  hitCache(req, res, next) {
    if (__PROD__ && routeCache.cache.has(req.path)) {
      return res.send(routeCache.cache.get(req.path));
    }

    next();
  },
  async preCache(string, route) {
    if (__PROD__ && routeCache.routes.includes(route)) {
      const directoryArray = await makeDirectory(route);
      const file = path.join.apply(
        null,
        [process.cwd(), 'public'].concat(directoryArray, 'index.html')
      );

      try {
        directoryArray.reduce((p, c) => {
          const dir = path.join(p, c);

          if (!fs.existsSync(dir)) fs.mkdirSync(dir);

          return dir;
        }, path.join(process.cwd(), 'public'));
        fs.writeFileSync(file, string);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }

    return string;
  }
};

export default routeCache;
