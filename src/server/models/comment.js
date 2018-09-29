const mongoose = require('mongoose');

const { Schema } = mongoose;
const Comment = new Schema(
  {},
  {
    timestamps: true
  }
);

Comment.statics.addComment = function() {};
Comment.statics.edit = function() {};

if (mongoose.models && mongoose.models.Comment) delete mongoose.models.Comment;

module.exports = mongoose.model('Comment', Comment);
