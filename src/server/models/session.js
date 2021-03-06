import mongoose from 'mongoose';
import uuid from 'uuid/v4';
import User from './user';

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
  const session = await this.create({ hash, user });

  await User.findByIdAndUpdate(user, {
    $addToSet: { sessions: hash }
  });

  return session.hash;
};

Session.statics.findUser = async function({ session: hash }) {
  const session = await this.findOne({ hash });
  const user = await User.findById(session.user);

  return user;
};

if (mongoose.models && mongoose.models.Session) delete mongoose.models.Session;

export default mongoose.model('Session', Session);
