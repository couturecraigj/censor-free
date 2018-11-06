import { PubSub, withFilter } from 'apollo-server';
import Answer from '../../models/answer';
import Photo from '../../models/photo';
import Question from '../../models/question';
import Review from '../../models/review';
import Story from '../../models/story';
import Thought from '../../models/thought';
import Tip from '../../models/tip';
import Video from '../../models/video';
import WebPage from '../../models/webPage';
import Product from '../../models/product';
import Company from '../../models/company';
import Group from '../../models/group';
import User from '../../models/user';
import PostNode from '../../models/postNode';
import ObjectNode from '../../models/object';
import Searchable from '../../models/searchable';
import { COOKIE_TYPE_MAP } from '../../../common/types';
import * as Types from '../types';

const pubsub = new PubSub();

const AUTHENTICATION_ERROR = new Error('Authentication Error');

const resolvers = {
  Subscription: {
    fileConversionProgress: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([Types.FILE_UPLOAD_PROGRESS]),
        (payload, variables) => {
          return payload.uploadToken === variables.uploadToken;
        }
      )
    }
  },
  Query: {
    feed: (root, args, context) => PostNode.findPostNodes(args, context),
    search: (root, args, context) => Searchable.findSearchable(args, context),
    products: () => Product.find(),
    companies: () => Company.find(),
    groups: () => Group.find(),
    company: (root, args) => Company.findById(args.id),
    users: () => User.find({ userType: { $ne: 'Viewer' } }),
    user: (root, args) => User.findById(args.id),
    product: (root, args) => Product.findById(args.id),
    group: (root, args) => Group.findById(args.id),
    objFeed: (root, args, context) =>
      ObjectNode.getFeed({ node: args.id }, context),
    me: async (root, args, context) => {
      try {
        const user = await User.findMe(args, context);

        return user;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);

        return null;
      }
    }
  },
  Mutation: {
    logIn: async (parent, args) => {
      const me = await User.findOne({
        $or: [{ userName: args.nameEmail }, { email: args.nameEmail }]
      });

      if (!me) {
        throw AUTHENTICATION_ERROR;
      }

      if (!(await me.passwordsMatch(args.password))) {
        throw AUTHENTICATION_ERROR;
      }

      return me;
    },
    signUp: async (parent, args) => {
      const me = new User(args);

      await me.save();

      return me;
    },
    forgotPassword: async (parent, args, { res }) => {
      const token = await User.getResetToken(args);

      if (res && !res.headersSent) {
        res.cookie(COOKIE_TYPE_MAP.resetToken, token, {
          httpOnly: true,
          maxAge: 3000
        });
      }

      return token;
    },
    addProduct: async (parent, args, context) =>
      Product.createProduct(args, context),
    addCompany: async (parent, args, context) =>
      Company.createCompany(args, context),
    addGroup: async (parent, args, context) => Group.createGroup(args, context),
    addVideoFilters: async (parent, args, context) =>
      Video.addFilters(args, context),
    like: async (parents, args) => PostNode.like(args),
    dislike: async (parents, args) => PostNode.dislike(args),
    resetPassword: async (parent, args) => {
      const me = await User.resetPassword(args);

      return me;
    },
    addAnswer: async (parent, args, context) =>
      Answer.createAnswer(args, context),
    addComment: async (parent, args, context) =>
      Answer.createAnswer(args, context),
    addPhoto: async (parent, args, context) => Photo.createPhoto(args, context),
    addQuestion: async (parent, args, context) =>
      Question.createQuestion(args, context),
    addReview: async (parent, args, context) =>
      Review.createReview(args, context),
    addStory: async (parent, args, context) => Story.createStory(args, context),
    addThought: async (parent, args, context) =>
      Thought.createThought(args, context),
    addTip: async (parent, args, context) => Tip.createTip(args, context),
    addVideo: async (parent, args, context) => {
      return Video.createVideo(args, context, {
        // eslint-disable-next-line no-console
        progress: value =>
          pubsub.publish(Types.FILE_UPLOAD_PROGRESS, {
            fileConversionProgress: value,
            uploadToken: args.uploadToken
          })
      });
      // return Video.createVideo(args, context);
    },
    addWebPage: async (parent, args, context) =>
      WebPage.createWebPage(args, context)
  },
  Product: {
    img: async product => Photo.findById(product.img)
  },
  User: {
    img: async user => {
      const photo = await Photo.findById(user.img);

      if (photo) return photo;

      return User.getGravatarPhoto(user);
    }
  },
  Company: {
    img: async company => Photo.findById(company.img)
  },
  Group: {
    img: async company => Photo.findById(company.img)
  },
  Authentication: {
    token: (me, args, { res, req }) => {
      // console.log(me);
      const token = User.getTokenFromUser(me, { req, res });

      return token;
    },
    me: me => me
  },
  PostNode: {
    __resolveType(obj) {
      return obj.kind;
    }
  },
  UserNode: {
    __resolveType: (obj, args, context) => {
      if (context?.user?.id && obj.id === context.req.user.id) return 'Me';

      return 'User';
    }
  },
  SavedRecord: {
    __resolveType: obj => obj.kind
  },
  Searchable: {
    __resolveType: obj => obj.kind
  },
  CommentNode: {
    __resolveType: obj => obj.kind
  },
  Node: {
    __resolveType: obj => obj.kind
  },
  Object: {
    __resolveType: obj => obj.kind
  }
};

export default resolvers;
