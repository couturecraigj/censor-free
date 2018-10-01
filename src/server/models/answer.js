const mongoose = require('mongoose');
const PostNode = require('./postNode');

const { Schema } = mongoose;
const Answer = new Schema(
  {
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'PostNode'
    },
    title: {
      type: String
    },
    description: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

Answer.statics.createAnswer = async function(args, context) {
  const postNode = await PostNode.createPostNode(args, context);
  return mongoose.models.Answer.create(args, postNode);
};
Answer.statics.markBestAnswer = function() {};
Answer.statics.edit = function() {};
Answer.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Answer) delete mongoose.models.Answer;
module.exports = mongoose.model('Answer', Answer);
