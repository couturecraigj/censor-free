const mongoose = require('mongoose');

const { Schema } = mongoose;
const Tip = new Schema(
  {},
  {
    timestamps: true
  }
);

if (mongoose.models && mongoose.models.Tip) delete mongoose.models.Tip;

module.exports = mongoose.model('Tip', Tip);
