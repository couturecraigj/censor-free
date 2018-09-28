const mongoose = require('mongoose');

const { Schema } = mongoose;
const Post = new Schema(
  {},
  {
    timestamps: true
  }
);

if (mongoose.models && mongoose.models.Post) delete mongoose.models.Post;

module.exports = mongoose.model('Post', Post);
