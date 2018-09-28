const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const EMAIL_ALREADY_EXISTS = new Error('Email already exists');
const USERNAME_ALREADY_EXISTS = new Error('Username already exists');
const PASSWORDS_DO_NOT_MATCH = new Error('Passwords must match');
const EMAILS_DO_NOT_MATCH = new Error('Emails must match');

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
    bio: { type: String, match: /[a-z]/ },
    date: { type: Date, default: Date.now }
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

if (mongoose.models && mongoose.models.User) delete mongoose.models.User;

module.exports = mongoose.model('User', User);
