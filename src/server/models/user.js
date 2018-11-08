import bcrypt from 'bcrypt';
import crypto from 'crypto';
import mongoose from 'mongoose';
import Person from './person';
import Searchable from './searchable';
import { COOKIE_TYPE_MAP } from '../../common/types';

const EMAIL_ALREADY_EXISTS = new Error('Email already exists');
const USERNAME_ALREADY_EXISTS = new Error('Username already exists');
const PASSWORDS_DO_NOT_MATCH = new Error('Passwords must match');
const EMAILS_DO_NOT_MATCH = new Error('Emails must match');
const NO_USER_BY_THAT_EMAIL = new Error('No user by that email');
const NO_USER_WITH_THAT_TOKEN = new Error('No user with that token');

const filterOtherUserFields = user => {
  const { id, email, userName, userType } = user.toJSON();

  user.userObj = {
    id,
    email,
    userName,
    userType
  };

  return user;
};
const filterMeFields = user => {
  const {
    hash,
    previousHashes,
    reset,
    kind,
    sessions,
    sockets,
    ...others
  } = user.toJSON();

  user.userObj = others;

  return user;
};
/**
 * TODO: Make it so that Users can be listed as Invites
 * TODO: Make it so users can unsubscribe from updates
 *
 * TODO: Setup Google Authentication Method
 * TODO: Setup Facebook Authentication Method
 * TODO: Setup Twitter Authentication Method
 * TODO: Setup Auth0 Authentication Method
 * TODO: Setup GitHub Authentication Method
 * TODO: Setup TOTP Authentication Method
 * TODO: Setup LinkedIn Authentication Method
 * TODO: Setup WeChat Authentication Method
 * TODO: Setup Instagram Authentication Method
 * TODO: Setup Slack Authentication Method
 * TODO: Setup Reddit Authentication Method
 * TODO: Setup Tumblr Authentication Method
 * TODO: Setup WordPress Authentication Method
 *
 * TODO: Setup Pinterest Link
 * TODO: Setup DeviantArt Link
 * TODO: Setup YouTube Link
 * TODO: Setup Etsy Link
 * TODO: Setup Flickr Link
 * TODO: Setup Picasa Link
 */
const { Schema } = mongoose;
const User = new Schema(
  {
    // REFERENCES
    searchable: { type: Schema.Types.ObjectId },
    // UNIQUE
    userName: { type: String, unique: true },
    email: { type: String, unique: true, lowercase: true, required: true },

    // SECURE
    hash: { type: String },

    // USER INFO
    birthDate: { type: String },
    birthYear: { type: Number },
    birthMonth: { type: Number },
    birthDay: { type: Number },

    kind: { type: String, default: 'User' },

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
    emails: [
      { email: { type: String }, public: { type: Boolean, default: false } }
    ],
    person: {
      type: Schema.Types.ObjectId
    },

    // PRIVACY
    privacySetting: { type: String, enum: ['Only', 'Except'] },
    dataMode: {
      type: String,
      enum: [
        // Idea is to display data from Server
        'Server',
        // Or from in blockchain
        'Decentralized',
        // Or only when they are online (Use allot more data on their computer)
        'Mobile'
      ],
      default: 'Server'
    },
    sessions: [String],
    sockets: [String],
    onlyUserList: [Schema.Types.ObjectId],
    exceptUserList: [Schema.Types.ObjectId],
    userType: {
      type: String,
      enum: ['Person', 'Viewer', 'Advanced'],
      default: 'Person'
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

User.index({ email: 'text' });
User.index({ userName: 'text' });

User.pre('validate', async function() {
  const that = this.toJSON();

  if (!that.emails.some(({ email }) => email === this.email)) {
    this.emails.push({ email: this.email });
  }

  this.personObject = this.toJSON();
});

User.virtual('password').set(function(value) {
  this._password = value;
});

User.virtual('confirmPassword').set(function(value) {
  this._confirmPassword = value;
});

User.virtual('confirmEmail').set(function(value) {
  this._confirmEmail = value;
});

User.methods.addSocket = async function(socket) {
  await this.model('User').findOneAndUpdate(this.id, {
    $addToSet: { sockets: socket.id }
  });
  this.sockets = [...this.sockets, socket.id];

  return this;
};
User.methods.removeSocket = async function(socket) {
  await this.model('User').findOneAndUpdate(
    { _id: this.id, sockets: socket.id },
    {
      $set: { 'sockets.$': null }
    }
  );
  await this.model('User').findOneAndUpdate(
    { _id: this.id },
    {
      $pull: { sockets: null }
    }
  );
  this.sockets = this.sockets.filter(sock => sock !== socket.id);

  return this;
};

User.statics.removeAllOldSocketsAcrossAllNameSpaces = function(socket, io) {
  const findAllSockets = nameSpace =>
    new Promise(resolve => {
      io.of(nameSpace).clients(async (err, clients) => {
        resolve(clients);
      });
    });

  return new Promise(async (resolve, reject) => {
    let sockets = [];

    for (const nsp of Object.keys(io.nsps)) {
      sockets.push(await findAllSockets(nsp));
    }

    sockets = sockets.filter((v, i, arr) => arr.indexOf(v) === i);

    // console.log(socket);
    try {
      const users = await this.find({ sockets: { $nin: sockets } });

      for (const user of users) {
        await this.findByIdAndUpdate(user.id, {
          $set: {
            sockets: user.sockets.filter(socket => sockets.includes(socket))
          }
        });
      }

      // console.log(socket);

      return resolve();
    } catch (error) {
      reject(error);
    }
  });
};
User.statics.removeAllOldSockets = function(socket, io) {
  return new Promise((resolve, reject) => {
    io.clients(async (err, clients) => {
      try {
        const users = await this.find({ sockets: { $nin: clients } });

        for (const user of users) {
          await this.findByIdAndUpdate(user.id, {
            $set: {
              sockets: user.sockets.filter(socket => clients.includes(socket))
            }
          });
        }

        // console.log(socket);

        return resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
};

User.statics.setupUserFromSocket = async function(socket, nameSpace) {
  await this.removeAllOldSocketsAcrossAllNameSpaces(socket, nameSpace);
  let user;
  const token =
    socket.handshake.headers['x-token'] || socket.handshake.query.token;

  if (token) {
    user = await this.getUserFromToken(token);
  }

  if (user) {
    await user.addSocket(socket);
  }

  return user;
};

User.statics.getUserIdFromToken = async function(token, { res }) {
  if (!token) return;

  if (res && !res.headersSent) {
    const maxAge = 3999999999;
    const date = Date.now() + maxAge;

    res.cookie(COOKIE_TYPE_MAP.token, token, {
      httpOnly: true,
      expires: new Date(date),
      maxAge
    });
  }

  return token;
};
User.statics.getUserFromToken = async function(token, { res } = {}) {
  if (!token) return;

  if (res && !res.headersSent) {
    const maxAge = 3999999999;
    const date = Date.now() + maxAge;

    res.cookie(COOKIE_TYPE_MAP.token, token, {
      httpOnly: true,
      expires: new Date(date),
      maxAge
    });
  }

  const user = await this.findById(await token);

  if (!user) return;

  return filterOtherUserFields(user);
};
User.statics.getTokenFromUser = function(user, { res }) {
  const maxAge = 3999999999;
  const date = Date.now() + maxAge;

  if (res && !res.headersSent) {
    res.cookie(COOKIE_TYPE_MAP.token, user.id, {
      httpOnly: true,
      expires: new Date(date),
      maxAge
    });
  }

  return user.id;
};

User.pre('save', async function() {
  if (this._password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this._password, salt);

    this.set('hash', hash);
  }

  if (this.isNew) {
    if (this._password !== this._confirmPassword) throw PASSWORDS_DO_NOT_MATCH;

    if (this.email !== this._confirmEmail) throw EMAILS_DO_NOT_MATCH;

    if (await this.findOne({ email: this.email })) throw EMAIL_ALREADY_EXISTS;

    if (
      await this.findOne({
        userName: this.userName
      })
    )
      throw USERNAME_ALREADY_EXISTS;
  }

  if (this.userType === 'Person') {
    const person = await Person.createFromUser(this.personObject);

    this.person = person.id;
  }

  const searchable = await Searchable.createSearchable({}, this);

  this.searchable = searchable.id;
});

User.methods.passwordsMatch = async function(password) {
  return bcrypt.compare(password, this.hash);
};

User.statics.findMe = async function(args, context) {
  if (!context?.req?.user.id) return null;

  const user = await this.findById(context.req.user.id);

  return filterMeFields(user);
};
User.statics.getResetToken = async function({ email }) {
  const timeOut = Date.now() + 360000;
  const user = await this.findOne({ email });

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
  const userTokenMatch = await this.findOne({
    'reset.token': token,
    'reset.timeOut': { $gte: timeOut }
  });

  if (!userTokenMatch) throw NO_USER_WITH_THAT_TOKEN;

  const previousHash = userTokenMatch.hash;

  userTokenMatch.password = password;
  userTokenMatch.confirmPassword = confirmPassword;
  await userTokenMatch.save();
  const user = this.findByIdAndUpdate(
    userTokenMatch.id,
    {
      $unset: { reset: '' },
      $addToSet: { previousHashes: previousHash }
    },
    {
      new: true
    }
  );

  return filterOtherUserFields(user);
};

User.statics.getGravatarPhoto = async function(user, size = 1200) {
  const hash = crypto
    .createHash('md5')
    .update(user.email)
    .digest('hex');

  // TODO: Create a Default Image to be loaded
  return {
    id: hash,
    height: size,
    width: size,
    imgUri: `https://www.gravatar.com/avatar/${hash}?s=${size}`,
    title: 'Auto-Generated Image',
    description: 'We take images from gravatar to have images in most cases'
  };
  // console.log(hash);
};

User.statics.invite = function(args) {
  return args;
};
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

export default mongoose.model('User', User);
