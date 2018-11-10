import cookieParser from 'cookie-parser';
// import csrf from 'csurf';
import through2 from 'through2';
import compression from 'compression';
import express from 'express';
import apolloSchemaSetup from '../graphql/schema';
import DataBase from '../database';
import User from '../models/user';
import Photo from '../models/photo';
import routeCache from '../routeCache';
import api from './api';

(() => {
  if (process.env.CLIENT_SERVER) return;

  process.env.CLIENT_SERVER = 'both';
})();
const CLIENT_SERVER = process.env.CLIENT_SERVER;

// const CLIENT_ONLY = CLIENT_SERVER === 'client';
const SERVER_ONLY = CLIENT_SERVER === 'server';

const onlyWhen = (bool, message = 'Not Allowed') => (req, res, next) => {
  if (bool) return next();

  return next(new Error(message));
};
const dbPromise = DataBase.get();

// const csrfProtection = csrf({ cookie: true });
const port = process.env.PORT || 3000;

export default app => {
  // eslint-disable-next-line no-console
  console.log(CLIENT_SERVER);
  app.enable('strict routing');
  app.use(cookieParser());
  app.use(compression());
  // app.use(csrfProtection);
  app.use(express.static('public'));
  app.set('port', port);

  app.use(routeCache.hitCache);
  app.use(onlyWhen(!SERVER_ONLY), async (req, res, next) => {
    try {
      req.user = await (async () => {
        const token = req.cookies.token;
        const authorization = (req.headers.authorization || '').replace(
          'Bearer ',
          ''
        );

        let userId;

        if (token || authorization) {
          userId = await User.getUserFromToken(token || authorization, {
            req,
            res
          });
        }

        return userId;
      })();
      req.io = app.get('io');
      req.createWriteStream = function(
        id,
        fileNameArray,
        socket,
        {
          readyMessage = 'FILE:streamDown$ready',
          chunkMessage = 'FILE:streamDown$chunk'
          // endMessage = 'FILE:streamDown$end'
        }
      ) {
        return new Promise(resolve => {
          socket.emit(readyMessage, id, fileNameArray, () => {
            resolve(
              through2(function transformFn(chunk, enc, callback) {
                socket.emit(chunkMessage, id, chunk, callback);
                // },
                // function flushFn(cb) {
                //   socket.emit(endMessage);
                //   cb();
              })
            );
          });
        });
      };
      req.db = await dbPromise;
      next();
    } catch (e) {
      next(e);
    }
  });

  // (async appliction => {
  //   appliction.set('database', await dbPromise);
  // })(app);
  app.use('/api', onlyWhen(!SERVER_ONLY), api);
  // app.get('/csurf', function(req, res) {
  //   res.json(req.csrfToken());
  // });

  app.get(
    '/photo/:width/:height*',
    onlyWhen(!SERVER_ONLY),
    async (req, res, next) => {
      // console.log(req.url);
      const { width, height } = req.params;

      try {
        await Photo.getImageOfCertainSize(
          req.params[0],
          { width, height, req },
          res
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        next(new Error('Internal Server Error'));
      }
    }
  );

  apolloSchemaSetup(app);

  if (!app.get('apollo'))
    app.set('apollo', {
      clientOnly: true,
      graphqlUrl: process.env.EXTERNAL_GRAPHQL_URL,
      graphqlSubscriptionURL: process.env.EXTERNAL_GRAPHQL_SUBSCRIPTION_URL
    });

  return app;
};
