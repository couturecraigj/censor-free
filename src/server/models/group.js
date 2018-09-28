const mongoose = require('mongoose');

const { Schema } = mongoose;
const Group = new Schema(
  {},
  {
    timestamps: true
  }
);

if (mongoose.models && mongoose.models.Group) delete mongoose.models.Group;

module.exports = mongoose.model('Group', Group);
