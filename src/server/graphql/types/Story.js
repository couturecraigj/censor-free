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
  type Story implements Node & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    title: String! @index(type: "text")
    description: String! @index(type: "text")
    comments: [Comment]!
    excerpt: String!
    created: AlterationStamp!
    modified: AlterationStamp
  }
`;

export { resolver, typeDef };
