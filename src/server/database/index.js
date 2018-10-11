import Database from 'mongoose';

const __DEV__ = process.env.NODE_ENV !== 'production';

Database.connect(
  __DEV__ ? 'mongodb://localhost/no_censor' : 'mongodb://mongo:27017/no_censor',
  { useNewUrlParser: true }
);

export default {
  get: async () => {
    return Database;
  }
};
