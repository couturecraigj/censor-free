import mongoose from 'mongoose';
import Photo from './photo';
import ObjectNode from './object';
import Searchable from './searchable';

const { Schema } = mongoose;
const Company = new Schema(
  {
    name: { type: String, index: true },
    description: { type: String, index: true },
    object: { type: Schema.Types.ObjectId },
    searchable: { type: Schema.Types.ObjectId },
    kind: { type: String, default: 'Company' },
    img: { type: Schema.Types.ObjectId },
    createdUser: { type: Schema.Types.ObjectId },
    modifiedUser: { type: Schema.Types.ObjectId }
  },
  {
    timestamps: true
  }
);

Company.statics.createCompany = async function(args, context) {
  if (!args.imgUri) throw new Error('Company image was not provided');
  if (!args.name) throw new Error('Companies must have names');
  const photo = await Photo.createPhoto({ imgUri: args.imgUri }, context);
  const company = await mongoose.models.Company.create({
    ...args,
    img: photo.id
  });
  const searchable = await Searchable.createSearchable(args, company, context);
  const object = await ObjectNode.createObject(args, company, context);
  company.searchable = searchable.id;
  photo.objects = [object.id];
  // TODO: Create a way to add Objects to a Photo using a virtual
  await photo.save();
  return company;
};
Company.statics.edit = function() {};
Company.statics.delete = function() {};
Company.statics.addSoldProduct = function() {};
Company.statics.addManufacturedProduct = function() {};
Company.statics.follow = function() {};
Company.statics.unfollow = function() {};
Company.statics.like = function() {};
Company.statics.unlike = function() {};
Company.statics.dislike = function() {};
Company.statics.getProducts = function() {};
Company.statics.getEmployees = function() {};
Company.statics.getSimilar = function() {};
Company.statics.addComment = function() {};
Company.statics.addPhoto = function() {};
Company.statics.addQuestion = function() {};
Company.statics.addReview = function() {};
Company.statics.addStory = function() {};
Company.statics.addThought = function() {};
Company.statics.addTip = function() {};
Company.statics.addVideo = function() {};
Company.statics.addWebPage = function() {};

if (mongoose.models && mongoose.models.Company) delete mongoose.models.Company;

export default mongoose.model('Company', Company);
