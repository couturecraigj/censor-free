import mongoose from 'mongoose';

const { Schema } = mongoose;
const Product = new Schema(
  {
    name: { type: String },
    description: { type: String },
    kind: { type: String, default: 'Product' }
  },
  {
    timestamps: true
  }
);

Product.statics.createProduct = function() {};
Product.statics.edit = function() {};
Product.statics.delete = function() {};
Product.statics.addRetailer = function() {};
Product.statics.addManufacturer = function() {};
Product.statics.removeFromWishList = function() {};
Product.statics.addToWishList = function() {};
Product.statics.want = function() {};
Product.statics.dontWant = function() {};
Product.statics.have = function() {};
Product.statics.follow = function() {};
Product.statics.unfollow = function() {};
Product.statics.like = function() {};
Product.statics.unlike = function() {};
Product.statics.dislike = function() {};
Product.statics.getSimilar = function() {};
Product.statics.getSiblings = function() {};
Product.statics.getCompetitors = function() {};
Product.statics.getCompanions = function() {};
Product.statics.getAverageScore = function() {};
Product.statics.getMetricsRadar = function() {};
Product.statics.getScoreHistogram = function() {};
Product.statics.getScoreTimeline = function() {};
Product.statics.getCommonTopics = function() {};
Product.statics.getPostCount = function() {};
Product.statics.addComment = function() {};
Product.statics.addPhoto = function() {};
Product.statics.addQuestion = function() {};
Product.statics.addReview = function() {};
Product.statics.addStory = function() {};
Product.statics.addThought = function() {};
Product.statics.addTip = function() {};
Product.statics.addVideo = function() {};
Product.statics.addWebPage = function() {};

if (mongoose.models && mongoose.models.Product) delete mongoose.models.Product;

export default mongoose.model('Product', Product);
