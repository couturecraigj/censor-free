const mongoose = require('mongoose');

const { Schema } = mongoose;
const Save = new Schema(
  {},
  {
    timestamps: true
  }
);

Save.statics.create = function() {};
Save.statics.edit = function() {};
Save.statics.delete = function() {};
Save.statics.addComment = function() {};

if (mongoose.models && mongoose.models.Save) delete mongoose.models.Save;

export default mongoose.model('Save', Save);
