import mongoose from 'mongoose';
import PostNode from './postNode';
import Searchable from './searchable';

const { Schema } = mongoose;
const WebPage = new Schema(
  {
    title: { type: String, index: 'text' },
    postNode: { type: Schema.Types.ObjectId },
    searchable: { type: Schema.Types.ObjectId },
    description: { type: String, index: 'text' },
    imgs: [Schema.Types.ObjectId],
    img: Schema.Types.ObjectId,
    uri: { type: String },
    kind: { type: String, default: 'WebPage' }
  },
  {
    timestamps: true
  }
);

WebPage.statics.createWebPage = async function(args, context) {
  const thought = await mongoose.models.WebPage.create(args);
  const postNode = await PostNode.createPostNode(args, thought, context);
  const searchable = await Searchable.createSearchable(args, thought, context);
  thought.postNode = postNode.id;
  thought.searchable = searchable.id;
  await thought.save();
  return thought;
};
WebPage.statics.edit = function() {};
WebPage.statics.addComment = function() {};

if (mongoose.models && mongoose.models.WebPage) delete mongoose.models.WebPage;

export default mongoose.model('WebPage', WebPage);
