const mongoose = require('mongoose');

const { Schema } = mongoose;
const Answer = new Schema(
  {},
  {
    timestamps: true
  }
);

Answer.statics.markBestAnswer = function() {};
Answer.statics.edit = function() {};
Answer.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Answer) delete mongoose.models.Answer;
module.exports = mongoose.model('Answer', Answer);
