const cookieParser = require('cookie-parser');
// const csrf = require('csurf');
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const resumable = require('express-resumablejs');

const DataBase = require('../database');
const routeCache = require('../routeCache');

const cwd = process.cwd();
const dbPromise = DataBase.get();

const apolloSchemaSetup = require('../graphql/schema');

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

module.exports = app => {
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
          req.cookies.token || req.headers.authorization.replace('Bearer ', '')
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
    const dir = path.join(cwd, 'uploads', req.cookies.token);
    fs.mkdir(dir, err => {
      // eslint-disable-next-line no-console
      if (err) console.error(err);
      return resumable({
        // eslint-disable-next-line no-console
        log: console.log,
        dest: dir
      })(req, res, next);
    });
  });
  app.post('/file', upload.single('avatar'), function(req, res) {
    res.send(req.file);
  });

  apolloSchemaSetup(app);
  return app;
};
