const mongoose = require('mongoose');

const { Schema } = mongoose;
const Review = new Schema(
  {},
  {
    timestamps: true
  }
);

Review.statics.edit = function() {};
Review.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Review) delete mongoose.models.Review;

module.exports = mongoose.model('Review', Review);
