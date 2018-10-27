import mongoose from 'mongoose';
import './answer';
import './photo';
import './question';
import './review';
import './story';
import './thought';
import './tip';
import './video';
import './webPage';
import orderedSet from './utils/orderedSet';
import { FILTER_TYPE_ENUM, POST_TYPE_ENUM } from '../../common/types';

/**
 * TODO: Create a way to like
 * TODO: Create a way to dislike
 */

const ENUM_DOESNT_MATCH = new Error('This is not a Kind that is allowed');

const UNAUTHORIZED_USER = new Error('Unauthorized User');
const { Schema } = mongoose;
const Flag = new Schema(
  {
    flag: {
      type: String,
      enum: FILTER_TYPE_ENUM
    },
    startTimeCode: {
      type: Number
    },
    endTimeCode: {
      type: Number
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    coordinates: {
      fromTop: Number,
      fromLeft: Number,
      height: Number,
      width: Number
    },
    investigation: {
      type: String,
      enum: [
        'New',
        'Researching',
        'Escalated',
        'Getting Confirmation',
        'Valid',
        'Invalid'
      ]
    }
  },
  {
    timestamps: true
  }
);
const PostNode = new Schema(
  {
    changeableType: {
      type: Boolean
    },
    objects: [Schema.Types.ObjectId],
    node: {
      type: Schema.Types.ObjectId,
      required: true
    },
    submittedFilters: {
      type: Boolean,
      default: false
    },
    kind: {
      type: String,
      enum: POST_TYPE_ENUM,
      required: true
    },
    published: {
      type: Boolean,
      default: false
    },
    publishedDate: {
      type: Number,
      default: Date.now
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    createdUser: { type: Schema.Types.ObjectId },
    modifiedUser: { type: Schema.Types.ObjectId },
    flags: [Flag]
  },
  {
    timestamps: true
  }
);

PostNode.statics.delete = function() {};
PostNode.statics.createPostNode = async function(args, obj = {}, context) {
  if (!POST_TYPE_ENUM.includes(obj.kind)) throw ENUM_DOESNT_MATCH;
  return mongoose.models.PostNode.create({
    user: context.req.user.id,
    createdUser: context.req.user.id,
    modifiedUser: context.req.user.id,
    node: obj.id,
    kind: obj.kind,
    published: args.published,
    publishedDate: args.published
  });
};

PostNode.statics.findPostNodes = async function(args) {
  const nodes = await mongoose.models.PostNode.find(args);
  return orderedSet(nodes);
};

PostNode.statics.addObjects = async function(id, objects, user) {
  const node = await mongoose.models.PostNode.findOne({
    node: id,
    modifiedUser: user.id
  });
  node.objects = objects;
  await node.save();
  return node;
};

PostNode.statics.publish = async function(args, context) {
  const postNode = mongoose.models.PostNode.findOne(args);
  if (postNode.user !== context.cookie.token) throw UNAUTHORIZED_USER;
  return mongoose.models.PostNode.findOneAndUpdate(args, {
    modifiedUser: context.req.user.id,
    published: true,
    publishedDate: Date.now()
  });
};
PostNode.statics.unPublish = function() {};
PostNode.statics.flagScam = function() {};
PostNode.statics.flagCopyRightsViolation = function() {};
PostNode.statics.flagPrivacy = function() {};
PostNode.statics.addLike = function() {};
PostNode.statics.addDislike = function() {};
PostNode.statics.flagNudity = function() {};
PostNode.statics.flagSex = function() {};
PostNode.statics.flagViolence = function() {};
PostNode.statics.flagWeapons = function() {};
PostNode.statics.flagFrightening = function() {};
PostNode.statics.flagGross = function() {};
PostNode.statics.flagSmoking = function() {};
PostNode.statics.flagDrugs = function() {};
PostNode.statics.flagAlcohol = function() {};
PostNode.statics.flagLanguage = function() {};

if (mongoose.models && mongoose.models.PostNode)
  delete mongoose.models.PostNode;
export default mongoose.model('PostNode', PostNode);
