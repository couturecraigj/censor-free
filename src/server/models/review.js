const mongoose = require('mongoose');
const PostNode = require('./postNode');

const { Schema } = mongoose;
const Review = new Schema(
  {
    title: { type: String },
    description: { type: String },
    score: { type: Number },
    products: [Schema.Types.ObjectId]
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

module.exports = mongoose.model('Review', Review);
