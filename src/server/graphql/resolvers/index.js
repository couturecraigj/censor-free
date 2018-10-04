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

      if (!user) {
        throw AUTHENTICATION_ERROR;
      }
      if (!(await user.passwordsMatch(args.password))) {
        throw AUTHENTICATION_ERROR;
      }
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
    addAnswer: async (parent, args, context) => {
      return Answer.createAnswer(args, context);
    },
    addComment: async (parent, args, context) => {
      return Answer.createAnswer(args, context);
    },
    addPhoto: async (parent, args, context) => {
      return Photo.createPhoto(args, context);
    },
    addQuestion: async (parent, args, context) => {
      return Question.createQuestion(args, context);
    },
    addReview: async (parent, args, context) => {
      return Review.createReview(args, context);
    },
    addStory: async (parent, args, context) => {
      return Story.createStory(args, context);
    },
    addThought: async (parent, args, context) => {
      return Thought.createThought(args, context);
    },
    addTip: async (parent, args, context) => {
      return Tip.createTip(args, context);
    },
    addVideo: async (parent, args, context) => {
      await Video.createDifferentVideoFormats(args, context, {
        progress: console.log
      });
      return Video.createVideo(args, context);
    },
    addWebPage: async (parent, args, context) => {
      return WebPage.createWebPage(args, context);
    }
  },
  User: async (parent, args) => {
    return User.findById(args.id);
  }
};

export default resolvers;
