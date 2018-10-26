import mongoose from 'mongoose';
import PostNode from './postNode';
import Searchable from './searchable';

const { Schema } = mongoose;
const Story = new Schema(
  {
    title: { type: String, index: true },
    postNode: { type: Schema.Types.ObjectId },
    searchable: { type: Schema.Types.ObjectId },
    description: { type: String, index: true },
    kind: { type: String, default: 'Story' },
    excerpt: { type: String }
  },
  {
    timestamps: true
  }
);

Story.statics.createStory = async function(args, context) {
  const story = await mongoose.models.Story.create(args);
  const searchable = await Searchable.createSearchable(args, story, context);
  const postNode = await PostNode.createPostNode(args, story, context);
  story.postNode = postNode.id;
  story.searchable = searchable.id;
  await story.save();
  return story;
};

Story.statics.edit = function() {};
Story.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Story) delete mongoose.models.Story;

export default mongoose.model('Story', Story);
