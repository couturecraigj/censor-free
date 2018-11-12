// import { withFilter } from 'apollo-server';
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
import * as Types from '../types';
import pubSub from './pubSub';
// import ObjectNode from '../../models/object';
// import Searchable from '../../models/searchable';
import { COOKIE_TYPE_MAP } from '../../../common/types';

const AUTHENTICATION_ERROR = new Error('Authentication Error');

const Mutation = {
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
        pubSub.publish(Types.FILE_UPLOAD_PROGRESS, {
          fileConversionProgress: value,
          uploadToken: args.uploadToken
        })
    });
    // return Video.createVideo(args, context);
  },
  addWebPage: async (parent, args, context) =>
    WebPage.createWebPage(args, context)
};

export default Mutation;
