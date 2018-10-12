import mongoose from 'mongoose';

const { Schema } = mongoose;
const Company = new Schema(
  {
    name: { type: String },
    description: { type: String },
    kind: { type: String, default: 'Company' }
  },
  {
    timestamps: true
  }
);

Company.statics.create = function() {};
Company.statics.edit = function() {};
Company.statics.delete = function() {};
Company.statics.addSoldProduct = function() {};
Company.statics.addManufacturedProduct = function() {};
Company.statics.follow = function() {};
Company.statics.unfollow = function() {};
Company.statics.like = function() {};
Company.statics.unlike = function() {};
Company.statics.dislike = function() {};
Company.statics.getProducts = function() {};
Company.statics.getEmployees = function() {};
Company.statics.getSimilar = function() {};
Company.statics.addComment = function() {};
Company.statics.addPhoto = function() {};
Company.statics.addQuestion = function() {};
Company.statics.addReview = function() {};
Company.statics.addStory = function() {};
Company.statics.addThought = function() {};
Company.statics.addTip = function() {};
Company.statics.addVideo = function() {};
Company.statics.addWebPage = function() {};

if (mongoose.models && mongoose.models.Company) delete mongoose.models.Company;

export default mongoose.model('Company', Company);
