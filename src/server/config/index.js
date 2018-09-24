const multer = require('multer');
const resumable = require('express-resumablejs')({
  // eslint-disable-next-line no-console
  log: console.log,
  dest: 'uploads/'
});

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
const port = 3000;

module.exports = app => {
  app.set('port', port);
  app.set('url', 'http://localhost:3000');
  app.use('/files', resumable);
  app.post('/file', upload.single('avatar'), function(req, res) {
    res.send(req.file);
  });

  apolloSchemaSetup(app);
  return app;
};
