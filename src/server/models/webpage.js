const mongoose = require('mongoose');

const { Schema } = mongoose;
const WebPage = new Schema(
  {},
  {
    timestamps: true
  }
);

if (mongoose.models && mongoose.models.WebPage) delete mongoose.models.WebPage;

module.exports = mongoose.model('WebPage', WebPage);
