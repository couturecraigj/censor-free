const mongoose = require('mongoose');

const { Schema } = mongoose;
const Save = new Schema(
  {},
  {
    timestamps: true
  }
);

if (mongoose.models && mongoose.models.Save) delete mongoose.models.Save;

module.exports = mongoose.model('Save', Save);
