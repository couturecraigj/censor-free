import mongoose from 'mongoose';
import PostNode from './postNode';

const { Schema } = mongoose;
const Comment = new Schema(
  {
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'PostNode'
    },
    description: {
      type: String
    },
    kind: { type: String, default: 'Comment' }
  },
  {
    timestamps: true
  }
);

Comment.statics.createComment = async function(args, context) {
  const postNode = await PostNode.createPostNode(args, context);

  return this.create(args, postNode);
};
Comment.statics.addComment = function() {};
Comment.statics.edit = function() {};

if (mongoose.models && mongoose.models.Comment) delete mongoose.models.Comment;

export default mongoose.model('Comment', Comment);
