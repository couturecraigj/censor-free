const mongoose = require('mongoose');
const PostNode = require('./postNode');

const { Schema } = mongoose;
const Thought = new Schema(
  {
    title: { type: String },
    description: { type: String }
  },
  {
    timestamps: true
  }
);

Thought.statics.createThought = async function(args, context) {
  const postNode = await PostNode.createPostNode(args, context);
  return mongoose.models.Thought.create(args, postNode);
};
Thought.statics.edit = function() {};
Thought.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Thought) delete mongoose.models.Thought;

module.exports = mongoose.model('Thought', Thought);
