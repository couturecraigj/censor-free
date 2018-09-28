const mongoose = require('mongoose');

const { Schema } = mongoose;
const Review = new Schema(
  {},
  {
    timestamps: true
  }
);

if (mongoose.models && mongoose.models.Review) delete mongoose.models.Review;

module.exports = mongoose.model('Review', Review);
