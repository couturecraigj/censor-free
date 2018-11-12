// import { PubSub, withFilter } from 'apollo-server';
// import Answer from '../../models/answer';
// import Photo from '../../models/photo';
// import Question from '../../models/question';
// import Review from '../../models/review';
// import Story from '../../models/story';
// import Thought from '../../models/thought';
// import Tip from '../../models/tip';
// import Video from '../../models/video';
// import WebPage from '../../models/webPage';
import Product from '../../models/product';
import Company from '../../models/company';
import Group from '../../models/group';
import User from '../../models/user';
import PostNode from '../../models/postNode';
import ObjectNode from '../../models/object';
import Searchable from '../../models/searchable';

const Query = {
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
};

export default Query;
