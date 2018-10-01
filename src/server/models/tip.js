const mongoose = require('mongoose');
const PostNode = require('./postNode');

const { Schema } = mongoose;
const Tip = new Schema(
  {
    title: { type: String },
    description: { type: String },
    products: [Schema.Types.ObjectId]
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

module.exports = mongoose.model('Tip', Tip);
