// import Photo from '../../models/photo';
// import User from '../../models/user';
import { resolver as User } from '../types/User';
import { resolver as Product } from '../types/Product';
import { resolver as Company } from '../types/Company';
import { resolver as Group } from '../types/Group';
import { resolver as Authentication } from '../types/Authentication';

const resolvers = {
  Product,
  User,
  Company,
  Group,
  Authentication,
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
