const mongoose = require('mongoose');

const { Schema } = mongoose;
const Photo = new Schema(
  {},
  {
    timestamps: true
  }
);

if (mongoose.models && mongoose.models.Photo) delete mongoose.models.Photo;

module.exports = mongoose.model('Photo', Photo);
