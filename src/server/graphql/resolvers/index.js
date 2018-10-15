import Answer from '../../models/answer';
import Photo from '../../models/photo';
import Question from '../../models/question';
import Review from '../../models/review';
import Story from '../../models/story';
import Thought from '../../models/thought';
import Tip from '../../models/tip';
import User from '../../models/user';
import Video from '../../models/video';
import WebPage from '../../models/webPage';
import PostNode from '../../models/postNode';
import Searchable from '../../models/searchable';

const AUTHENTICATION_ERROR = new Error('Authentication Error');

const resolvers = {
  Query: {
    feed: (root, args, context) => PostNode.findPostNodes(args, context),
    search: (root, args, context) => Searchable.findSearchable(args, context),
    me: (root, args, context) => {
      try {
        return User.findMe(args, context);
      } catch (e) {
        // console.log(e);
        return e;
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
      res.cookie('reset-token', token, { httpOnly: true, maxAge: 3000 });
      return token;
    },
    frightening: async (parents, args) => PostNode.flagFrightening(args),
    sex: async (parents, args) => PostNode.flagSex(args),
    scam: async (parents, args) => PostNode.flagScam(args),
    copyRightsViolation: async (parents, args) =>
      PostNode.flagCopyRightsViolation(args),
    privacy: async (parents, args) => PostNode.flagPrivacy(args),
    like: async (parents, args) => PostNode.like(args),
    dislike: async (parents, args) => PostNode.dislike(args),
    nudity: async (parents, args) => PostNode.flagNudity(args),
    violence: async (parents, args) => PostNode.flagViolence(args),
    weapons: async (parents, args) => PostNode.flagWeapons(args),
    gross: async (parents, args) => PostNode.flagGross(args),
    smoking: async (parents, args) => PostNode.flagSmoking(args),
    drugs: async (parents, args) => PostNode.flagDrugs(args),
    alcohol: async (parents, args) => PostNode.flagAlcohol(args),
    language: async (parents, args) => PostNode.flagLanguage(args),
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
      await Video.createDifferentVideoFormats(args, context, {
        // eslint-disable-next-line no-console
        progress: console.log
      });
      return Video.createVideo(args, context);
    },
    addWebPage: async (parent, args, context) =>
      WebPage.createWebPage(args, context)
  },
  Authentication: {
    token: (me, args, { res }) => {
      // console.log(me);
      res.cookie('token', me.id, { httpOnly: true, maxAge: 9999999 });
      return me.id;
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
      if (context?.user?.id && obj.id === context.user.id) return 'Me';
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
