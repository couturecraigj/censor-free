const mongoose = require('mongoose');

const { Schema } = mongoose;
const Thought = new Schema(
  {},
  {
    timestamps: true
  }
);

Thought.statics.edit = function() {};
Thought.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Thought) delete mongoose.models.Thought;

module.exports = mongoose.model('Thought', Thought);
