const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const EMAIL_ALREADY_EXISTS = new Error('Email already exists');
const USERNAME_ALREADY_EXISTS = new Error('Username already exists');
const PASSWORDS_DO_NOT_MATCH = new Error('Passwords must match');
const EMAILS_DO_NOT_MATCH = new Error('Emails must match');
const NO_USER_BY_THAT_EMAIL = new Error('No user by that email');
const NO_USER_WITH_THAT_TOKEN = new Error('No user with that token');

const { Schema } = mongoose;
const User = new Schema(
  {
    userName: { type: String },
    email: { type: String },
    hash: { type: String },
    birthDate: { type: String },
    birthYear: { type: Number },
    birthMonth: { type: Number },
    birthDay: { type: Number },
    reset: {
      token: { type: String },
      timeOut: { type: Number }
    }
  },
  {
    timestamps: true
  }
);

User.virtual('password').set(function(value) {
  this._password = value;
});

User.virtual('confirmPassword').set(function(value) {
  this._confirmPassword = value;
});

User.virtual('confirmEmail').set(function(value) {
  this._confirmEmail = value;
});

User.pre('save', async function() {
  if (this._password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this._password, salt);
    this.set('hash', hash);
  }
  if (this.isNew) {
    if (this._password !== this._confirmPassword) throw PASSWORDS_DO_NOT_MATCH;
    if (this.email !== this._confirmEmail) throw EMAILS_DO_NOT_MATCH;
    if (await mongoose.models.User.findOne({ email: this.email }))
      throw EMAIL_ALREADY_EXISTS;
    if (
      await mongoose.models.User.findOne({
        userName: this.userName
      })
    )
      throw USERNAME_ALREADY_EXISTS;
  }
});

User.methods.passwordsMatch = async function(password) {
  return bcrypt.compare(password, this.hash);
};

User.statics.getResetToken = async function({ email }) {
  const timeOut = Date.now() + 360000;
  const user = await mongoose.models.User.findOne({ email });
  if (!user) throw NO_USER_BY_THAT_EMAIL;
  const salt = await bcrypt.genSalt(15);
  const token = await bcrypt
    .hash(`${email}${timeOut}`, salt)
    .then(token => token.replace(/[$/_.]/g, '_'));

  user.reset.token = token;
  user.reset.timeOut = timeOut;
  await user.save();
  return token;
};

User.statics.resetPassword = async function({
  token,
  password,
  confirmPassword
}) {
  if (password !== confirmPassword) throw PASSWORDS_DO_NOT_MATCH;
  const timeOut = Date.now();
  const userTokenMatch = await mongoose.models.User.findOne({
    'reset.token': token,
    'reset.timeOut': { $gte: timeOut }
  });
  if (!userTokenMatch) throw NO_USER_WITH_THAT_TOKEN;
  const user = mongoose.models.User.findOneAndUpdate(
    {
      'reset.token': token,
      'reset.timeOut': { $gte: timeOut }
    },
    {
      $set: {
        password,
        confirmPassword
      },
      $unset: { reset: '' }
    },
    {
      new: true
    }
  );
  return user;
};

if (mongoose.models && mongoose.models.User) delete mongoose.models.User;

module.exports = mongoose.model('User', User);
