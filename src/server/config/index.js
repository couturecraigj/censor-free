import cookieParser from 'cookie-parser';
// import csrf from 'csurf';
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import resumable from 'express-resumablejs';
import apolloSchemaSetup from '../graphql/schema';
import DataBase from '../database';
import Photo from '../models/photo';
import routeCache from '../routeCache';

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
  app.use(cookieParser());
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
  // app.get('/csurf', function(req, res) {
  //   res.json(req.csrfToken());
  // });
  app.use('/files', (req, res, next) => {
    if (!req.user.id)
      return next(new Error('Cannot upload files when you are not logged in'));
    const dir = path.join(cwd, 'uploads', req.cookies.token);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    return resumable({
      // eslint-disable-next-line no-console
      log: console.log,
      dest: dir
    })(req, res, next);
  });
  app.get('/photo/:width/:height/:folder/:name', async (req, res, next) => {
    const { width, height, name, folder } = req.params;
    try {
      await Photo.getImageOfCertainSize(folder, name, { width, height }, res);
    } catch (e) {
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
