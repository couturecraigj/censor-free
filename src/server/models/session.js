import User from './user';

const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const { Schema } = mongoose;
const Session = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    hash: { type: String, unique: true }
  },
  {
    timestamps: true
  }
);

Session.statics.createSession = async function({ user }) {
  const hash = uuid();
  const session = await mongoose.models.Session.create({ hash, user });
  await User.findByIdAndUpdate(user, {
    $addToSet: { sessions: hash }
  });
  return session.hash;
};

Session.statics.findUser = async function({ session: hash }) {
  const session = await mongoose.models.Session.findOne({ hash });
  const user = await User.findById(session.user);
  return user;
};

if (mongoose.models && mongoose.models.Session) delete mongoose.models.Session;

export default mongoose.model('Session', Session);
