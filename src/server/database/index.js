import Database from 'mongoose';

Database.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true }
);

export default {
  get: async () => {
    return Database;
  }
};
