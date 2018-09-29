const mongoose = require('mongoose');

const { Schema } = mongoose;
const Question = new Schema(
  {},
  {
    timestamps: true
  }
);

Question.statics.edit = function() {};
Question.statics.addAnswer = function() {};
Question.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Question)
  delete mongoose.models.Question;

module.exports = mongoose.model('Question', Question);
