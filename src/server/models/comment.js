const mongoose = require('mongoose');

const { Schema } = mongoose;
const Comment = new Schema(
  {},
  {
    timestamps: true
  }
);

if (mongoose.models && mongoose.models.Comment) delete mongoose.models.Comment;

module.exports = mongoose.model('Comment', Comment);
