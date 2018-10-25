import mongoose from 'mongoose';
import PostNode from './postNode';

const { Schema } = mongoose;
const Story = new Schema(
  {
    title: { type: String },
    postNode: { type: Schema.Types.ObjectId },
    description: { type: String },
    kind: { type: String, default: 'Story' },
    excerpt: { type: String }
  },
  {
    timestamps: true
  }
);

Story.statics.createStory = async function(args, context) {
  const postNode = await PostNode.createPostNode(args, context);
  return mongoose.models.Story.create(args, postNode);
};

Story.statics.edit = function() {};
Story.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Story) delete mongoose.models.Story;

export default mongoose.model('Story', Story);
