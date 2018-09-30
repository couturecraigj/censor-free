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
    // UNIQUE
    userName: { type: String },
    email: { type: String },

    // SECURE
    hash: { type: String },

    // USER INFO
    birthDate: { type: String },
    birthYear: { type: Number },
    birthMonth: { type: Number },
    birthDay: { type: Number },

    // PREFERENCES
    filterOut: [
      {
        type: String,
        enum: [
          'Nudity',
          'Sex',
          'Violence',
          'Weapons',
          'Frightening',
          'Gross',
          'Smoking',
          'Drugs',
          'Alcohol'
        ]
      }
    ],

    objectTypes: [
      {
        type: String,
        enum: ['User', 'Product', 'Company', 'Group']
      }
    ],

    // OTHER SITES
    webPages: [{ type: Schema.Types.ObjectId, ref: 'WebPage' }],
    otherSocials: [
      {
        type: String,
        enum: [
          'YouTube',
          'Twitter',
          'Facebook',
          'DeviantArt',
          'LinkedIn',
          'Tumblr',
          'Picasa',
          'Flickr',
          'Google+',
          'Instagram',
          'Pinterest',
          'Etsy'
        ]
      }
    ],
    emails: [String],

    // PRIVACY
    privacySetting: { type: String, enum: ['Only', 'Except'] },
    dataMode: {
      type: String,
      enum: [
        // Idea is to display data from Server
        'Server',
        // Or from in blockchain
        'Decentralized',
        // Or only when they are online (Use alot more data on their computer)
        'Mobile'
      ]
    },
    onlyUserList: [Schema.Types.ObjectId],
    exceptUserList: [Schema.Types.ObjectId],
    userType: {
      type: String,
      enum: ['User', 'Viewer', 'Advanced']
    },
    authorization: [
      {
        type: String,
        enum: [
          'Administrator',
          'Moderator-Final',
          'Moderator-Third',
          'Moderator-Second',
          'Moderator-First'
        ]
      }
    ],
    reset: {
      token: { type: String },
      timeOut: { type: Number }
    },
    previousHashes: [String]
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
  const previousHash = userTokenMatch.hash;
  userTokenMatch.password = password;
  userTokenMatch.confirmPassword = confirmPassword;
  await userTokenMatch.save();
  const user = mongoose.models.User.findByIdAndUpdate(
    userTokenMatch.id,
    {
      $unset: { reset: '' },
      $addToSet: { previousHashes: previousHash }
    },
    {
      new: true
    }
  );
  return user;
};

User.statics.invite = function() {};
User.statics.requestFriendship = function() {};
User.statics.acceptFriendship = function() {};
User.statics.rejectFriendship = function() {};
User.statics.blockUser = function() {};
User.statics.unblockUser = function() {};
User.statics.changeProfileContent = function() {};
User.statics.follow = function() {};
User.statics.addComment = function() {};
User.statics.addPhoto = function() {};
User.statics.addQuestion = function() {};
User.statics.addReview = function() {};
User.statics.addStory = function() {};
User.statics.addThought = function() {};
User.statics.addTip = function() {};
User.statics.addVideo = function() {};
User.statics.addWebPage = function() {};

if (mongoose.models && mongoose.models.User) delete mongoose.models.User;

module.exports = mongoose.model('User', User);
