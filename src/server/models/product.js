import mongoose from 'mongoose';
import slug from 'slug';
import Photo from './photo';
import ObjectNode from './object';
import Searchable from './searchable';

const { Schema } = mongoose;
const Product = new Schema(
  {
    name: { type: String },
    slug: { type: String },
    object: { type: Schema.Types.ObjectId },
    searchable: { type: Schema.Types.ObjectId },
    description: { type: String },
    kind: { type: String, default: 'Product' },
    img: { type: Schema.Types.ObjectId },
    createdUser: { type: Schema.Types.ObjectId },
    modifiedUser: { type: Schema.Types.ObjectId }
  },
  {
    timestamps: true
  }
);

Product.index({ name: 'text', description: 'text' });

Product.statics.createProduct = async function(args, context) {
  if (!args.imgUri) throw new Error('Product image was not provided');
  if (!args.name) throw new Error('Products must have names');
  const photo = await Photo.createPhoto({ imgUri: args.imgUri }, context);
  const product = await mongoose.models.Product.create({
    ...args,
    slug: slug(args.name),
    img: photo.id
  });
  const searchable = await Searchable.createSearchable(args, product, context);
  const object = await ObjectNode.createObject(args, product, context);
  product.searchable = searchable.id;
  photo.products.push(product.id);
  photo.objects = [object.id];
  // TODO: Create a way to add Objects to a Photo using a virtual
  await photo.save();
  return product;
};
Product.statics.edit = function() {};
Product.statics.delete = function() {};
Product.statics.addRetailer = function() {};
Product.statics.addManufacturer = function() {};
Product.statics.removeFromWishList = function() {};
Product.statics.addToWishList = function() {};
Product.statics.want = function() {};
Product.statics.dontWant = function() {};
Product.statics.have = function() {};
Product.statics.follow = function() {};
Product.statics.unfollow = function() {};
Product.statics.like = function() {};
Product.statics.unlike = function() {};
Product.statics.dislike = function() {};
Product.statics.getSimilar = function() {};
Product.statics.getSiblings = function() {};
Product.statics.getCompetitors = function() {};
Product.statics.getCompanions = function() {};
Product.statics.getAverageScore = function() {};
Product.statics.getMetricsRadar = function() {};
Product.statics.getScoreHistogram = function() {};
Product.statics.getScoreTimeline = function() {};
Product.statics.getCommonTopics = function() {};
Product.statics.getPostCount = function() {};
Product.statics.addComment = function() {};
Product.statics.addPhoto = function() {};
Product.statics.addQuestion = function() {};
Product.statics.addReview = function() {};
Product.statics.addStory = function() {};
Product.statics.addThought = function() {};
Product.statics.addTip = function() {};
Product.statics.addVideo = function() {};
Product.statics.addWebPage = function() {};

if (mongoose.models && mongoose.models.Product) delete mongoose.models.Product;

export default mongoose.model('Product', Product);
