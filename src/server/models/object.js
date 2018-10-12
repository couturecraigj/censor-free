import mongoose from 'mongoose';

import './product';
import './company';

const ENUM_DOESNT_MATCH = new Error('This is not a Kind that is allowed');
const kinds = ['Product', 'Company'];

const { Schema } = mongoose;

const ObjectNode = new Schema(
  {
    node: {
      type: Schema.Types.ObjectId
    },
    kind: {
      type: String,
      enum: kinds
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

ObjectNode.statics.delete = function() {};
ObjectNode.statics.createObject = function(obj, context, kind) {
  if (!kinds.includes(kind)) throw ENUM_DOESNT_MATCH;
  return mongoose.models.ObjectNode.create({
    node: obj.id,
    kind,
    user: context.req.user.id
  });
};

if (mongoose.models && mongoose.models.Object) delete mongoose.models.Object;
export default mongoose.model('Object', ObjectNode);
