const mongoose = require('mongoose');
const PostNode = require('./postNode');

const { Schema } = mongoose;
const WebPage = new Schema(
  {
    title: { type: String },
    description: { type: String },
    imgs: [Schema.Types.ObjectId],
    img: Schema.Types.ObjectId,
    uri: { type: String }
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

module.exports = mongoose.model('WebPage', WebPage);
