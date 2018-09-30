const mongoose = require('mongoose');

const { Schema } = mongoose;
const Photo = new Schema(
  {
    title: String,
    description: String,
    height: { type: Number },
    width: { type: Number },
    imgUri: String
  },
  {
    timestamps: true
  }
);

Photo.statics.edit = function() {};
Photo.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Photo) delete mongoose.models.Photo;

module.exports = mongoose.model('Photo', Photo);
