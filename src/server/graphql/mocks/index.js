import { MockList } from 'apollo-server';

import casual from 'casual';

const unionInterface = (mockMap, list) => {
  return mockMap[list[casual.integer(0, list.length - 1)]](casual.uuid);
};

// const User = require('../../models/user').default;

const mocks = {
  Id: () => Math.random(),
  Int: () => casual.integer(-1000, 1000),
  Float: () => casual.double(-1000, 1000),
  String: () => casual.string,
  Thought: () => ({
    id: 'Thought' + casual.uuid,
    title: casual.title,
    description: casual.description,
    __typename: 'Thought'
  }),
  Me: () => ({
    id: '',
    firstName: ''
  }),
  Story: () => {
    const description = casual.sentences(50);
    const excerpt = description
      .split('. ')
      .filter((v, i) => i < 4)
      .join('. ');

    return {
      id: 'Thought' + casual.uuid,
      title: casual.title,
      excerpt,
      description,
      __typename: 'Thought'
    };
  },
  Group: () => ({
    id: 'Group' + casual.uuid,
    title: casual.title,
    description: casual.description,
    __typename: 'Group'
  }),
  Comment: () => ({
    id: 'Comment' + casual.uuid,
    title: casual.title,
    description: casual.description,
    __typename: 'Comment'
  }),
  Mutation: () => ({
    signUp: (parent, args, { res }) => {
      const token = casual.uuid;

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 9999999,
        sameSite: true
      });

      return {
        user: mocks.User(token),
        token
      };
    },
    // logIn: async (parent, args, { res }) => {
    //   const token = casual.uuid;
    //   const user = new User();
    //   await user.save();
    //   // eslint-disable-next-line
    //   console.log(user);
    //   res.cookie('token', token, {
    //     httpOnly: true,
    //     maxAge: 9999999,
    //     sameSite: true
    //   });
    //   return {
    //     user,
    //     token
    //   };
    // },
    logOut: (parent, args, { res }) => {
      res.clearCookie('token');

      return 'Successfully Logged Out!';
    },
    resetPassword: (parent, args, { res, req }) => {
      if (
        req.cookies['reset-token'] &&
        req.cookies['reset-token'] === args.resetToken
      ) {
        // eslint-disable-next-line no-console
        console.log('resetTokens match');
        res.clearCookie('reset-token');
      }

      const token = casual.uuid;

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 9999999,
        sameSite: true
      });

      return {
        user: mocks.User(token),
        token
      };
    },
    forgotPassword: (parent, args, { res }) => {
      const token = casual.uuid;

      res.cookie('reset-token', token, {
        httpOnly: true,
        maxAge: 9999999,
        sameSite: true
      });

      return casual.uuid;
    },
    addVideo: (parent, args) => {
      // eslint-disable-next-line no-console
      console.log(args);
    },
    addPhoto: (parent, args) => {
      // eslint-disable-next-line no-console
      console.log(args);
    },
    addThought: (parent, args) => {
      // eslint-disable-next-line no-console
      console.log(args);
    },
    addReview: (parent, args) => {
      // eslint-disable-next-line no-console
      console.log(args);
    },
    addQuestion: (parent, args) => {
      // eslint-disable-next-line no-console
      console.log(args);
    },
    addAnswer: (parent, args) => {
      // eslint-disable-next-line no-console
      console.log(args);
    },
    addStory: (parent, args) => {
      // eslint-disable-next-line no-console
      console.log(args);
    },
    addTip: (parent, args) => {
      // eslint-disable-next-line no-console
      console.log(args);
    },

    deletePost: (parent, args) => {
      // eslint-disable-next-line no-console
      console.log(args);
    }
  }),

  Query: () => ({
    feed: () => new MockList([0, 20], mocks.PostUnion),
    me: () => 'null',
    saved: () => new MockList([8, 20], mocks.Save),
    companies: () => new MockList([0, 20]),
    products: () => new MockList([0, 20], mocks.Product),
    groups: () => new MockList([0, 20], mocks.Group),
    users: () => new MockList([0, 20], mocks.User),
    videos: () => new MockList([0, 20], mocks.Video),
    search: () => new MockList([8, 20], mocks.Searchable)
  }),
  PostUnion: () =>
    unionInterface(mocks, [
      'Thought',
      'Review',
      'Question',
      'Answer',
      'Photo',
      'Video',
      'WebPage',
      'Tip'
    ]),
  Searchable: () =>
    unionInterface(mocks, [
      'Thought',
      'Review',
      'Question',
      'Comment',
      'Group',
      'Product',
      'Company',
      'User',
      'Answer',
      'Photo',
      'Video',
      'WebPage',
      'Tip'
    ]),
  Save: () => ({
    id: casual.uuid,
    imgUri: `https://via.placeholder.com/${casual.integer(
      20,
      400
    )}x${casual.integer(20, 400)}`,
    objectId: casual.uuid,
    object: () =>
      unionInterface(mocks, ['Product', 'Company', 'WebPage', 'Photo', 'Video'])
  }),
  SavedRecord: (obj = {}) => ({
    id: obj.objectId || casual.uuid,
    __typename: 'SavedRecord'
  }),
  Review: (obj = {}) => ({
    __typename: 'Review',
    kind: 'Review',
    id: 'Review' + (obj.objectId || casual.uuid),
    name: casual.title,
    description: casual.description,
    score: casual.double(0, 5)
  }),
  Question: (obj = {}) => ({
    __typename: 'Question',
    kind: 'Question',
    id: 'Question' + (obj.objectId || casual.uuid),
    name: casual.title,
    description: casual.description
  }),
  Tip: (obj = {}) => ({
    __typename: 'Tip',
    kind: 'Tip',
    id: 'Tip' + (obj.objectId || casual.uuid),
    name: casual.title,
    description: casual.description
  }),
  Answer: (obj = {}) => ({
    __typename: 'Answer',
    kind: 'Answer',
    id: 'Answer' + (obj.objectId || casual.uuid),
    name: casual.title,
    description: casual.description
  }),
  Product: (obj = {}) => ({
    __typename: 'Product',
    kind: 'Product',
    id: 'Product' + (obj.objectId || casual.uuid),
    imgUri: `https://picsum.photos/${casual.integer(30, 500)}/${casual.integer(
      30,
      500
    )}/?random`,
    name: casual.title,
    description: casual.description
  }),
  User: (obj = {}) => ({
    __typename: 'User',
    kind: 'User',
    id: 'User' + (obj.objectId || casual.uuid),
    name: casual.full_name,
    description: casual.description
  }),
  Company: (obj = {}) => {
    return {
      __typename: 'Company',
      kind: 'Company',
      id: 'Company' + (obj.objectId || casual.uuid),
      name: casual.title,
      description: casual.description
    };
  },
  WebPage: (obj = {}) => ({
    __typename: 'WebPage',
    kind: 'WebPage',
    id: 'WebPage' + (obj.objectId || casual.uuid),
    title: casual.title,
    description: casual.description
  }),
  Photo: (obj = {}) => {
    const height = casual.integer(30, 500);
    const width = casual.integer(30, 500);

    return {
      __typename: 'Photo',
      kind: 'Photo',
      id: 'Photo' + (obj.objectId || casual.uuid),
      imgUri: `https://picsum.photos/${height}/${width}/?random`,
      title: casual.title,
      height,
      width,
      description: casual.description
    };
  },
  Video: (obj = {}) => ({
    __typename: 'Video',
    kind: 'Video',
    id: 'Video' + (obj.objectId || casual.uuid),
    title: casual.title,
    description: casual.description
  })
};

export default mocks;
