const User = require('../../models/users');

const AUTHENTICATION_ERROR = new Error('Authentication Error');

const resolvers = {
  // Query: {
  //   // hello: () => 'Hello world!'
  // },
  Mutation: {
    logIn: async (parent, args, { res }) => {
      const user = await User.findOne({
        $or: [{ userName: args.nameEmail }, { email: args.nameEmail }],
        password: args.password
      });
      if (!user) throw AUTHENTICATION_ERROR;
      res.cookie('token', user.id, { httpOnly: true, maxAge: 9999999 });
      return {
        user,
        token: user.id
      };
    },
    signUp: async (parent, args, { res }) => {
      const { email, confirmEmail, password, confirmPassword, name } = args;
      if (password !== confirmPassword)
        throw new Error('passwords do not match');
      if (email !== confirmEmail) throw new Error('Emails do not match');
      const username = await User.findOne({ username: name }).then(
        ({ username }) => username
      );
      if (username) throw new Error('Username already taken!');

      const userExists = await User.findOne({ email: args.email }).then(
        user => !!user
      );
      if (userExists) throw new Error('User already exists!');
      const user = new User(args);
      await user.save();
      res.cookie('token', user.id, { httpOnly: true, maxAge: 9999999 });
      return {
        user,
        token: user.id
      };
    }
  },
  // Authentication: async (...args) => {
  //   // eslint-disable-next-line
  //   console.log(args);
  //   return args;
  // },
  User: async (...args) => {
    // eslint-disable-next-line
    console.log(args);
    return args;
  }
  // Post: {}
  // Save: {
  //   object: {
  //     __resolveType() {
  //       // obj, context, info
  //       return 'Product';
  //       // return null;
  //     }
  //   }
  // }
  // SavedRecord: {
  //   __resolveType() {
  //     // obj, context, info
  //     //
  //     return 'Product';
  //     // return null;
  //   }
  // },
  // Node: {
  //   __resolveType() {
  //     // obj, context, info
  //     //
  //     return 'Product';
  //     // return null;
  //   }
  // }
};

module.exports = resolvers;
