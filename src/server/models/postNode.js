const mongoose = require('mongoose');

const { Schema } = mongoose;
const PostNode = new Schema(
  {
    changeableType: {
      type: Boolean
    },
    published: {
      type: Boolean
    },
    publishedDate: {
      type: Boolean
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

PostNode.delete = function() {};

PostNode.publish = function() {};
PostNode.unPublish = function() {};
PostNode.flagScam = function() {};
PostNode.flagCopyRightsViolation = function() {};
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
