const mongoose = require('mongoose');

const { Schema } = mongoose;
const Company = new Schema(
  {
    name: { type: String },
    description: { type: String }
  },
  {
    timestamps: true
  }
);

if (mongoose.models && mongoose.models.Company) delete mongoose.models.Company;

module.exports = mongoose.model('Company', Company);
