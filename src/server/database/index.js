const Database = require('mongoose');

Database.connect('mongodb://localhost/no_censor');

require('../models/user');
// const RxDB = require('rxdb');

// const user = require('../models/user');

// RxDB.plugin(require('pouchdb-adapter-node-websql'));
// // RxDB.plugin(require('pouchdb-adapter-http'));
// const __DEV__ = process.env.NODE_ENV === 'development';
// const Database = {};

// const create = async function() {
//   const db = await RxDB.create({
//     name: 'userdb',
//     adapter: 'websql',
//     password: 'myLongAndStupidPassword',
//     multiInstance: true,
//     ignoreDuplicate: __DEV__
//   });
//   await user(db);
//   return db;
// };

// let createPromise = null;
// Database.get = async () => {
//   if (!createPromise) createPromise = create();
//   return createPromise;
// };

module.exports = {
  get: async () => {
    return Database;
  }
};
