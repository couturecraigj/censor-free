const Database = require('mongoose');

Database.connect(
  'mongodb://localhost/no_censor',
  { useNewUrlParser: true }
);

require('../models/user');

module.exports = {
  get: async () => {
    return Database;
  }
};
