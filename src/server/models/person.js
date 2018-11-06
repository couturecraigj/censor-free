import mongoose from 'mongoose';

const { Schema } = mongoose;
const Person = new Schema(
  {
    // UNIQUE
    userName: { type: String },

    // USER INFO
    birthDate: { type: String },
    birthYear: { type: Number },
    birthMonth: { type: Number },
    birthDay: { type: Number },

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
    kind: { type: String, default: 'Person' }
  },
  {
    timestamps: true
  }
);

Person.statics.createFromUser = async function(data) {
  const personObj = {
    ...data,
    emails: data.emails
      .filter(({ public: boo }) => boo)
      .map(({ email }) => email)
  };

  delete personObj._id;
  let person;

  if (data.person) {
    person = await this.findByIdAndUpdate(data.person, personObj, {
      new: true
    });
  } else {
    person = await this.create(personObj);
  }

  return person;
};

Person.statics.requestFriendship = function() {};
Person.statics.acceptFriendship = function() {};
Person.statics.rejectFriendship = function() {};
Person.statics.blockUser = function() {};
Person.statics.unblockUser = function() {};
Person.statics.changeProfileContent = function() {};
Person.statics.follow = function() {};
Person.statics.unfollow = function() {};

if (mongoose.models && mongoose.models.Person) delete mongoose.models.Person;

export default mongoose.model('Person', Person);
