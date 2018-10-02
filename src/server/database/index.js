import Database from 'mongoose';

Database.connect(
  'mongodb://localhost/no_censor',
  { useNewUrlParser: true }
);

export default {
  get: async () => {
    return Database;
  }
};
