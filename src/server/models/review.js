import mongoose from 'mongoose';
import PostNode from './postNode';
import Searchable from './searchable';

const { Schema } = mongoose;
const Review = new Schema(
  {
    title: { type: String, index: 'text' },
    description: { type: String, index: 'text' },
    postNode: { type: Schema.Types.ObjectId },
    searchable: { type: Schema.Types.ObjectId },
    score: { type: Number },
    products: [Schema.Types.ObjectId],
    kind: { type: String, default: 'Review' }
  },
  {
    timestamps: true
  }
);

Review.statics.createReview = async function(args, context) {
  const review = await this.create(args);
  const searchable = await Searchable.createSearchable(args, review, context);
  const postNode = await PostNode.createPostNode(args, review, context);

  review.postNode = postNode.id;
  review.searchable = searchable.id;
  await review.save();

  return review;
};
Review.statics.edit = function() {};
Review.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Review) delete mongoose.models.Review;

export default mongoose.model('Review', Review);
