const cookieParser = require('cookie-parser');
// const csrf = require('csurf');
const express = require('express');
const multer = require('multer');
const resumable = require('express-resumablejs')({
  // eslint-disable-next-line no-console
  log: console.log,
  dest: 'uploads/'
});

const DataBase = require('../database');

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
  app.use(async (req, res, next) => {
    try {
      req.db = await dbPromise;
      next();
    } catch (e) {
      next(e);
    }
  });
  // app.get('/csurf', function(req, res) {
  //   res.json(req.csrfToken());
  // });
  app.use('/files', resumable);
  app.post('/file', upload.single('avatar'), function(req, res) {
    res.send(req.file);
  });

  apolloSchemaSetup(app);
  return app;
};
