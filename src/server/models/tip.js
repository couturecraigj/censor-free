import mongoose from 'mongoose';
import PostNode from './postNode';

const { Schema } = mongoose;
const Tip = new Schema(
  {
    title: { type: String },
    description: { type: String },
    products: [Schema.Types.ObjectId],
    kind: { type: String, default: 'Tip' }
  },
  {
    timestamps: true
  }
);

Tip.statics.createTip = async function(args, context) {
  const postNode = await PostNode.createPostNode(args, context);
  return mongoose.models.Tip.create(args, postNode);
};
Tip.statics.edit = function() {};
Tip.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Tip) delete mongoose.models.Tip;

export default mongoose.model('Tip', Tip);
