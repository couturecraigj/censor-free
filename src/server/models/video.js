import mongoose from 'mongoose';
import PostNode from './postNode';

const { Schema } = mongoose;
const Video = new Schema(
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

Video.statics.createVideo = async function(args, context) {
  const postNode = await PostNode.createPostNode(args, context);
  return mongoose.models.Video.create(args, postNode);
};
Video.statics.edit = function() {};
Video.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Video) delete mongoose.models.Video;

export default mongoose.model('Video', Video);
