import mongoose from 'mongoose';
import PostNode from './postNode';

const { Schema } = mongoose;
const Review = new Schema(
  {
    title: { type: String },
    description: { type: String },
    postNode: { type: Schema.Types.ObjectId },
    score: { type: Number },
    products: [Schema.Types.ObjectId],
    kind: { type: String, default: 'Review' }
  },
  {
    timestamps: true
  }
);

Review.statics.createReview = async function(args, context) {
  const postNode = await PostNode.createPostNode(args, context);
  return mongoose.models.Review.create(args, postNode);
};
Review.statics.edit = function() {};
Review.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Review) delete mongoose.models.Review;

export default mongoose.model('Review', Review);
