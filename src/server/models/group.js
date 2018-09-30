const mongoose = require('mongoose');

const { Schema } = mongoose;
const Group = new Schema(
  {},
  {
    timestamps: true
  }
);

Group.statics.delete = function() {};
Group.statics.create = function() {};
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

module.exports = mongoose.model('Group', Group);
