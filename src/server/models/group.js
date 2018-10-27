import mongoose from 'mongoose';
import slug from 'slug';
import Photo from './photo';
import Searchable from './searchable';

const { Schema } = mongoose;
const Group = new Schema(
  {
    title: { type: String, index: 'text' },
    searchable: { type: Schema.Types.ObjectId },
    description: { type: String, index: 'text' },
    img: { type: Schema.Types.ObjectId },
    kind: { type: String, default: 'Group' },
    createdUser: { type: Schema.Types.ObjectId },
    modifiedUser: { type: Schema.Types.ObjectId }
  },
  {
    timestamps: true
  }
);

Group.statics.createGroup = async function(args, context) {
  if (!args.imgUri) throw new Error('Group image was not provided');
  if (!args.title) throw new Error('Groups must have titles');
  const photo = await Photo.createPhoto({ imgUri: args.imgUri }, context);
  const group = await mongoose.models.Group.create({
    ...args,
    slug: slug(args.title),
    img: photo.id,
    createdUser: context.req.user.id,
    modifiedUser: context.req.user.id
  });
  const searchable = await Searchable.createSearchable(args, group, context);
  group.searchable = searchable.id;
  await photo.save();
  return group;
};

Group.statics.delete = function() {};
Group.statics.edit = function() {};
Group.statics.rejectJoin = function() {};
Group.statics.acceptJoin = function() {};
Group.statics.requestJoin = function() {};
Group.statics.addComment = function() {};
Group.statics.addPhoto = function() {};
Group.statics.addQuestion = function() {};
Group.statics.addReview = function() {};
Group.statics.addStory = function() {};
Group.statics.addThought = function() {};
Group.statics.addTip = function() {};
Group.statics.addVideo = function() {};
Group.statics.addWebPage = function() {};

if (mongoose.models && mongoose.models.Group) delete mongoose.models.Group;

export default mongoose.model('Group', Group);
