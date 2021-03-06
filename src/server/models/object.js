import mongoose from 'mongoose';

import './product';
import './company';
import './postNode';

const ENUM_DOESNT_MATCH = new Error('This is not a Kind that is allowed');
const kinds = ['Product', 'Company'];

/**
 * TODO: Create a way to follow
 * TODO: Create a way to own
 * TODO: Create a way to want
 * TODO: Create a way to sold
 */

const { Schema } = mongoose;

const ObjectNode = new Schema(
  {
    node: {
      type: Schema.Types.ObjectId,
      unique: true
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

ObjectNode.set('toJSON', { virtuals: true });
ObjectNode.statics.delete = function() {};
ObjectNode.statics.createObject = async function(args, node, context) {
  if (!kinds.includes(node.kind)) throw ENUM_DOESNT_MATCH;

  const object = await this.create({
    node: node.id,
    kind: node.kind,
    user: context.req.user.id
  });

  node.object = object.id;
  await node.save();

  return object;
};

ObjectNode.statics.getFeed = async function(args) {
  const obj = await this.findOne(args);

  return mongoose.models.PostNode.findPostNodes({
    objects: obj.id
  });
};

if (mongoose.models && mongoose.models.Object) delete mongoose.models.Object;

export default mongoose.model('Object', ObjectNode);
