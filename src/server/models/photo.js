const mongoose = require('mongoose');

const { Schema } = mongoose;
const Photo = new Schema(
  {},
  {
    timestamps: true
  }
);

Photo.statics.edit = function() {};
Photo.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Photo) delete mongoose.models.Photo;

module.exports = mongoose.model('Photo', Photo);
