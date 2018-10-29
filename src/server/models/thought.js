import mongoose from 'mongoose';
import PostNode from './postNode';
import Searchable from './searchable';

const { Schema } = mongoose;
const Thought = new Schema(
  {
    title: { type: String, index: 'text' },
    postNode: { type: Schema.Types.ObjectId },
    searchable: { type: Schema.Types.ObjectId },
    description: { type: String, index: 'text' },
    kind: { type: String, default: 'Thought' }
  },
  {
    timestamps: true
  }
);

Thought.statics.createThought = async function(args, context) {
  const thought = await mongoose.models.Thought.create(args);
  const postNode = await PostNode.createPostNode(args, thought, context);
  const searchable = await Searchable.createSearchable(args, thought, context);

  thought.postNode = postNode.id;
  thought.searchable = searchable.id;
  await thought.save();

  return thought;
};
Thought.statics.edit = function() {};
Thought.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Thought) delete mongoose.models.Thought;

export default mongoose.model('Thought', Thought);
