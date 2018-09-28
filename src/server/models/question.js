const mongoose = require('mongoose');

const { Schema } = mongoose;
const Question = new Schema(
  {},
  {
    timestamps: true
  }
);

if (mongoose.models && mongoose.models.Question)
  delete mongoose.models.Question;

module.exports = mongoose.model('Question', Question);
