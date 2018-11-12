import { gql } from 'apollo-server';
import User from '../../models/user';

const resolver = {
  token: (me, args, { res, req }) => {
    // console.log(me);
    const token = User.getTokenFromUser(me, { req, res });

    return token;
  },
  me: me => me
};

const typeDef = gql`
  type Authentication {
    token: String!
    me: Me!
  }
`;

export { resolver, typeDef };
