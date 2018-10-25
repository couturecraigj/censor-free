import mongoose from 'mongoose';
import DataLoader from 'dataloader';
import PostNode from './postNode';

const { Schema } = mongoose;
const Answer = new Schema(
  {
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'PostNode'
    },
    postNode: { type: Schema.Types.ObjectId },
    title: {
      type: String
    },
    description: {
      type: String
    },
    kind: { type: String, default: 'Answer' }
  },
  {
    timestamps: true
  }
);

Answer.statics.createAnswer = async function(args, context) {
  const postNode = await PostNode.createPostNode(args, context);
  return mongoose.models.Answer.create(args, postNode);
};

Answer.statics.createLoader = () => {
  mongoose.models.Answer.loader = new DataLoader(keys => {
    const Model = mongoose.models.Answer;
    return Promise.all(keys.map(key => Model.findById(key)));
  });
};
Answer.statics.clearLoader = () => {};

Answer.statics.markBestAnswer = function() {};
Answer.statics.edit = function() {};
Answer.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Answer) delete mongoose.models.Answer;
export default mongoose.model('Answer', Answer);
