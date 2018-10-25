import mongoose from 'mongoose';
import PostNode from './postNode';

const { Schema } = mongoose;
const WebPage = new Schema(
  {
    title: { type: String },
    postNode: { type: Schema.Types.ObjectId },
    description: { type: String },
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
  const postNode = await PostNode.createPostNode(args, context);
  return mongoose.models.WebPage.create(args, postNode);
};
WebPage.statics.edit = function() {};
WebPage.statics.addComment = function() {};

if (mongoose.models && mongoose.models.WebPage) delete mongoose.models.WebPage;

export default mongoose.model('WebPage', WebPage);
