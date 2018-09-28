const mongoose = require('mongoose');

const { Schema } = mongoose;
const Story = new Schema(
  {},
  {
    timestamps: true
  }
);

if (mongoose.models && mongoose.models.Story) delete mongoose.models.Story;

module.exports = mongoose.model('Story', Story);
