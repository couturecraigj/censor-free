const Photo = require('../../models/photo');
const User = require('../../models/user');

const AUTHENTICATION_ERROR = new Error('Authentication Error');

const resolvers = {
  Query: {
    // hello: () => 'Hello world!'
  },
  Mutation: {
    logIn: async (parent, args, { res }) => {
      const user = await User.findOne({
        $or: [{ userName: args.nameEmail }, { email: args.nameEmail }]
      });

      if (!user) throw AUTHENTICATION_ERROR;
      if (!(await user.passwordsMatch(args.password)))
        throw AUTHENTICATION_ERROR;
      res.cookie('token', user.id, { httpOnly: true, maxAge: 9999999 });
      return {
        user,
        token: user.id
      };
    },
    signUp: async (parent, args, { res }) => {
      const user = new User(args);
      await user.save();
      res.cookie('token', user.id, { httpOnly: true, maxAge: 9999999 });
      return {
        user,
        token: user.id
      };
    },
    forgotPassword: async (parent, args, { res }) => {
      const token = await User.getResetToken(args);
      res.cookie('reset-token', token, { httpOnly: true, maxAge: 3000 });
      return token;
    },
    resetPassword: async (parent, args) => {
      const user = await User.resetPassword(args);
      return {
        token: user.id,
        user
      };
    },
    addPhoto: async (parent, args, context) => {
      return await Photo.createPhoto(args, context);
    }
  },
  User: async (parent, args) => {
    return User.findById(args.id);
  }
};

module.exports = resolvers;
