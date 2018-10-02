import mongoose from 'mongoose';

const UNATHORIZED_USER = new Error('Unathorized User');
const { Schema } = mongoose;
const Flag = new Schema(
  {
    flag: {
      type: String,
      enum: [
        'Sex',
        'Nudity',
        'Violence',
        'Weapons',
        'Frightening',
        'Gross',
        'Smoking',
        'Drugs',
        'Alcohol',
        'Language',
        'Privacy',
        'Scam',
        'Copyright'
      ]
    },
    startTimeCode: {
      type: Number
    },
    endTimeCode: {
      type: Number
    },
    coordinates: {
      fromTop: Number,
      fromLeft: Number
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
    post: {
      type: Schema.Types.ObjectId
    },
    kind: {
      type: String,
      enum: [
        'Answer',
        'Photo',
        'Question',
        'Review',
        'Story',
        'Thought',
        'Tip',
        'Video',
        'WebPage'
      ]
    },
    published: {
      type: Boolean
    },
    publishedDate: {
      type: Number
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    flags: [Flag]
  },
  {
    timestamps: true
  }
);

PostNode.statics.delete = function() {};
PostNode.statics.createPostNode = async function(args, context) {
  return mongoose.models.PostNode.create({
    user: context.req.user.id,
    published: args.published,
    publishedDate: args.published ? Date.now() : undefined
  });
};

PostNode.statics.publish = async function(args, context) {
  const postNode = mongoose.models.PostNode.findOne(args);
  if (postNode.user !== context.cookie.token) throw UNATHORIZED_USER;
  return mongoose.models.PostNode.findOneAndUpdate(args, {
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
