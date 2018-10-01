const mongoose = require('mongoose');
const PostNode = require('./postNode');

const { Schema } = mongoose;
const Comment = new Schema(
  {
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'PostNode'
    },
    description: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

Comment.statics.createComment = async function(args, context) {
  const postNode = await PostNode.createPostNode(args, context);
  return mongoose.models.Comment.create(args, postNode);
};
Comment.statics.addComment = function() {};
Comment.statics.edit = function() {};

if (mongoose.models && mongoose.models.Comment) delete mongoose.models.Comment;

module.exports = mongoose.model('Comment', Comment);
