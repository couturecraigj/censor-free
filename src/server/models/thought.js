const mongoose = require('mongoose');

const { Schema } = mongoose;
const Thought = new Schema(
  {},
  {
    timestamps: true
  }
);

if (mongoose.models && mongoose.models.Thought) delete mongoose.models.Thought;

module.exports = mongoose.model('Thought', Thought);
