const mongoose = require('mongoose');

const { Schema } = mongoose;
const User = new Schema({
  userName: { type: String },
  email: { type: String },
  password: { type: String },
  age: { type: Number, min: 18, index: true },
  bio: { type: String, match: /[a-z]/ },
  date: { type: Date, default: Date.now },
  buff: Buffer
});
// TODO: Figure out how to make this hot-reload
module.exports = mongoose.models.User || mongoose.model('User', User);
