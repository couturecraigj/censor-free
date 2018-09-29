const mongoose = require('mongoose');

const { Schema } = mongoose;
const PostNode = new Schema(
  {},
  {
    timestamps: true
  }
);
//   - Nudity
//   - Sex
//   - Violence
//   - Guns/Weapons
//   - Frightening
//   - Gross
//   - Smoking
//   - Drugs/Alcohol
//   - Language
PostNode.delete = function() {};
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
