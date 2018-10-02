import mongoose from 'mongoose';
import PostNode from './postNode';

const { Schema } = mongoose;
const Photo = new Schema(
  {
    title: { type: String },
    description: { type: String },
    height: { type: Number },
    width: { type: Number },
    imgUri: { type: String }
  },
  {
    timestamps: true
  }
);

Photo.statics.createPhoto = async function(args, context) {
  const postNode = await PostNode.createPostNode(args, context);
  const photo = await mongoose.models.Photo.create(args);
  postNode.post = photo.id;
  postNode.kind = 'Photo';
  postNode.save();
  return photo;
};

Photo.statics.edit = function() {};
Photo.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Photo) delete mongoose.models.Photo;

export default mongoose.model('Photo', Photo);
