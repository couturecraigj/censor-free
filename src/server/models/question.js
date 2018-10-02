import mongoose from 'mongoose';
import PostNode from './postNode';

const { Schema } = mongoose;
const Question = new Schema(
  {
    title: { type: String },
    description: { type: String },
    products: [Schema.Types.ObjectId]
  },
  {
    timestamps: true
  }
);

Question.statics.createQuestion = async function(args, context) {
  const postNode = await PostNode.createPostNode(args, context);
  return mongoose.models.Question.create(args, postNode);
};
Question.statics.edit = function() {};
Question.statics.addAnswer = function() {};
Question.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Question)
  delete mongoose.models.Question;

export default mongoose.model('Question', Question);
