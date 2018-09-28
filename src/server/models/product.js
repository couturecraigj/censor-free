const mongoose = require('mongoose');

const { Schema } = mongoose;
const Product = new Schema(
  {
    name: { type: String },
    description: { type: String }
  },
  {
    timestamps: true
  }
);

if (mongoose.models && mongoose.models.Product) delete mongoose.models.Product;

module.exports = mongoose.model('Product', Product);
