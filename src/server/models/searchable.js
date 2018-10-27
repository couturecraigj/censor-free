import mongoose from 'mongoose';
import orderedSearch from './utils/orderedSearch';
import './thought';
import './story';
import './review';
import './question';
import './tip';
import './answer';
import './comment';
import './photo';
import './video';
import './webPage';
import './group';
import './product';
import './company';
import './user';

const ENUM_DOESNT_MATCH = new Error('This is not a Kind that is allowed');

const { Schema } = mongoose;

const kinds = [
  'Thought',
  'Story',
  'Review',
  'Question',
  'Tip',
  'Answer',
  'Comment',
  'Photo',
  'Video',
  'WebPage',
  'Group',
  'Product',
  'Company',
  'User'
];

const Searchable = new Schema(
  {
    node: {
      type: Schema.Types.ObjectId
    },
    kind: {
      type: String,
      enum: kinds
    },
    text: {
      type: String
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

Searchable.statics.delete = function() {};
Searchable.statics.createSearchable = function(args, obj, context) {
  if (!kinds.includes(obj.kind)) throw ENUM_DOESNT_MATCH;
  return mongoose.models.Searchable.create({
    node: obj.id,
    kind: obj.kind,
    user: context.req.user.id
  });
};
Searchable.statics.findSearchable = async function(args = {}) {
  const list = await mongoose.models.Searchable.find();
  return orderedSearch(list, undefined, args.text || '');
};

if (mongoose.models && mongoose.models.Searchable)
  delete mongoose.models.Searchable;
export default mongoose.model('Searchable', Searchable);
