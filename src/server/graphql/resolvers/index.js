import Query from './Query';
import Mutation from './Mutation';
import Subscription from './Subscription';
import scalars from './scalars';
import resolvers from './resolvers';
import enums from './enums';

const resolverMap = {
  ...resolvers,
  ...scalars,
  ...enums,
  Subscription,
  Query,
  Mutation
};

export default resolverMap;
