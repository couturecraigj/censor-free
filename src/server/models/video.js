const mongoose = require('mongoose');

const { Schema } = mongoose;
const Video = new Schema(
  {},
  {
    timestamps: true
  }
);

if (mongoose.models && mongoose.models.Video) delete mongoose.models.Video;

module.exports = mongoose.model('Video', Video);
