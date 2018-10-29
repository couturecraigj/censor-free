import mongoose from 'mongoose';
import './answer';
import './comment';

const kinds = ['Answer', 'Comment'];

/**
 * TODO: Create a way to like
 * TODO: Create a way to dislike
 */

const ENUM_DOESNT_MATCH = new Error('This is not a Kind that is allowed');

const { Schema } = mongoose;

const CommentNode = new Schema(
  {
    node: {
      type: Schema.Types.ObjectId
    },
    kind: {
      type: String,
      enum: kinds
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

CommentNode.statics.delete = function() {};
CommentNode.statics.createCommentNode = async function(args, context, kind) {
  if (!kinds.includes(kind)) throw ENUM_DOESNT_MATCH;

  return mongoose.models.CommentNode.create({
    user: context.req.user.id,
    kind,
    node: args.id
  });
};

if (mongoose.models && mongoose.models.CommentNode)
  delete mongoose.models.CommentNode;

export default mongoose.model('CommentNode', CommentNode);
