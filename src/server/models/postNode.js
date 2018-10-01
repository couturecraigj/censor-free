const mongoose = require('mongoose');

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

PostNode.delete = function() {};
PostNode.createPostNode = async function(args, context) {
  return mongoose.models.PostNode.create({
    user: context.req.token,
    published: args.published,
    publishedDate: args.published ? Date.now() : undefined
  });
};

PostNode.publish = async function(args, context) {
  const postNode = mongoose.models.PostNode.findOne(args);
  if (postNode.user !== context.cookie.token) throw UNATHORIZED_USER;
  return mongoose.models.PostNode.findOneAndUpdate(args, {
    published: true,
    publishedDate: Date.now()
  });
};
PostNode.unPublish = function() {};
PostNode.flagScam = function() {};
PostNode.flagCopyRightsViolation = function() {};
PostNode.flagPrivacy = function() {};
PostNode.addLike = function() {};
PostNode.addDislike = function() {};
PostNode.flagNudity = function() {};
PostNode.flagSex = function() {};
PostNode.flagViolence = function() {};
PostNode.flagWeapons = function() {};
PostNode.flagFrightening = function() {};
PostNode.flagGross = function() {};
PostNode.flagSmoking = function() {};
PostNode.flagDrugs = function() {};
PostNode.flagAlcohol = function() {};
PostNode.flagLanguage = function() {};

if (mongoose.models && mongoose.models.PostNode)
  delete mongoose.models.PostNode;
module.exports = mongoose.model('PostNode', PostNode);
