const mongoose = require('mongoose');
const PostNode = require('./postNode');

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
Photo.statics.createPhoto = async function(args, context) {
  const postNode = await PostNode.createPostNode(args, context);
  return mongoose.models.Photo.create(args, postNode);
};

if (mongoose.models && mongoose.models.Photo) delete mongoose.models.Photo;

module.exports = mongoose.model('Photo', Photo);
