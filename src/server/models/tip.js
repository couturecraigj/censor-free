import mongoose from 'mongoose';
import PostNode from './postNode';
import Searchable from './searchable';

const { Schema } = mongoose;
const Tip = new Schema(
  {
    title: { type: String, index: true },
    postNode: { type: Schema.Types.ObjectId },
    searchable: { type: Schema.Types.ObjectId },
    description: { type: String, index: true },
    products: [Schema.Types.ObjectId],
    kind: { type: String, default: 'Tip' }
  },
  {
    timestamps: true
  }
);

Tip.statics.createTip = async function(args, context) {
  const tip = await mongoose.models.Tip.create(args);
  const postNode = await PostNode.createPostNode(args, tip, context);
  const searchable = await Searchable.createSearchable(args, tip, context);
  tip.postNode = postNode.id;
  tip.searchable = searchable.id;
  await tip.save();
  return tip;
};
Tip.statics.edit = function() {};
Tip.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Tip) delete mongoose.models.Tip;

export default mongoose.model('Tip', Tip);
