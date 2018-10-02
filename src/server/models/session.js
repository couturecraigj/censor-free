const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const User = require('./user');

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
  const session = await mongoose.models.Session.create(
    Object.assign({ user }, { hash })
  );
  await User.findByIdAndUpdate(user, {
    $addToSet: { sessions: session.hash }
  });
  return session.hash;
};

Session.statics.findUser = async function({ session: hash }) {
  const session = await mongoose.models.Session.findOne({ hash });
  const user = await User.findById(session.user);
  return user;
};

if (mongoose.models && mongoose.models.Session) delete mongoose.models.Session;

module.exports = mongoose.model('Session', Session);
