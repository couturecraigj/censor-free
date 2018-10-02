import PostNode from './postNode';

const mongoose = require('mongoose');

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

export default mongoose.model('Thought', Thought);
