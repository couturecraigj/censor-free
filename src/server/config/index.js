import cookieParser from 'cookie-parser';
// import csrf from 'csurf';
import compression from 'compression';
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import resumable from 'express-resumablejs';
import apolloSchemaSetup from '../graphql/schema';
import DataBase from '../database';
import Photo from '../models/photo';
import routeCache from '../routeCache';
import api from './api';

const cwd = process.cwd();
const dbPromise = DataBase.get();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads');
  },
  filename(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '_' + file.originalname);
  }
});

const upload = multer({
  storage
});
// const csrfProtection = csrf({ cookie: true });
const port = 3000;

export default app => {
  app.enable('strict routing');
  app.use(cookieParser());
  app.use(compression());
  // app.use(csrfProtection);
  app.use(express.static('public'));
  app.set('port', port);
  app.set('url', 'http://localhost:3000');
  app.use(routeCache.hitCache);
  app.use(async (req, res, next) => {
    try {
      req.user = {
        id:
          req.cookies.token ||
          (req.headers.authorization || '').replace('Bearer ', '')
      };
      req.db = await dbPromise;
      next();
    } catch (e) {
      next(e);
    }
  });
  app.use('/api', api);
  // app.get('/csurf', function(req, res) {
  //   res.json(req.csrfToken());
  // });
  app.use('/files', (req, res, next) => {
    if (!req.user.id)
      return next(new Error('Cannot upload files when you are not logged in'));
    const dir = path.join(cwd, 'uploads', req.user.id);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    return resumable({
      // eslint-disable-next-line no-console
      log: console.log,
      dest: dir
    })(req, res, next);
  });
  app.get('/photo/:width/:height*', async (req, res, next) => {
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
  });
  app.post('/file', upload.single('avatar'), function(req, res) {
    res.send(req.file);
  });

  apolloSchemaSetup(app);
  return app;
};
