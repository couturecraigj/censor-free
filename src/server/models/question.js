import mongoose from 'mongoose';
import PostNode from './postNode';
import Searchable from './searchable';

const { Schema } = mongoose;
const Question = new Schema(
  {
    title: { type: String, index: 'text' },
    postNode: { type: Schema.Types.ObjectId },
    searchable: { type: Schema.Types.ObjectId },
    description: { type: String, index: 'text' },
    products: [Schema.Types.ObjectId],
    kind: { type: String, default: 'Question' }
  },
  {
    timestamps: true
  }
);

Question.statics.createQuestion = async function(args, context) {
  const question = await mongoose.models.Question.create(args);
  const postNode = await PostNode.createPostNode(args, question, context);
  const searchable = await Searchable.createSearchable(args, question, context);
  question.postNode = postNode.id;
  question.searchable = searchable.id;
  await question.save();
  return question;
};
Question.statics.edit = function() {};
Question.statics.addAnswer = function() {};
Question.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Question)
  delete mongoose.models.Question;

export default mongoose.model('Question', Question);
