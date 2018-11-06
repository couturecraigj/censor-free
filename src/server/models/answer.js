import mongoose from 'mongoose';
import DataLoader from 'dataloader';
import PostNode from './postNode';
import Searchable from './searchable';

const { Schema } = mongoose;
const Answer = new Schema(
  {
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'PostNode'
    },
    postNode: { type: Schema.Types.ObjectId },
    searchable: { type: Schema.Types.ObjectId },
    title: {
      type: String,
      index: 'text'
    },
    description: {
      type: String,
      index: 'text'
    },
    kind: { type: String, default: 'Answer' }
  },
  {
    timestamps: true
  }
);

Answer.statics.createAnswer = async function(args, context) {
  const answer = await this.create(args);
  const postNode = await PostNode.createPostNode(args, answer, context);
  const searchable = await Searchable.createSearchable(args, answer, context);

  answer.postNode = postNode.id;
  answer.searchable = searchable.id;
  await answer.save();

  return answer;
};

Answer.statics.createLoader = () => {
  this.loader = new DataLoader(keys => {
    return Promise.all(keys.map(key => this.findById(key)));
  });
};
Answer.statics.clearLoader = () => {};

Answer.statics.markBestAnswer = function() {};
Answer.statics.edit = function() {};
Answer.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Answer) delete mongoose.models.Answer;

export default mongoose.model('Answer', Answer);
