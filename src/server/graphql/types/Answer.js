import { gql } from 'apollo-server';
import Photo from '../../models/photo';

const resolver = {
  img: async company => Photo.findById(company.img)
};

const typeDef = gql`
  type Answer implements Node & CommentNode & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    question: Question
    title: String! @index(type: "text")
    description: String! @index(type: "text")
    comments: [Comment]!
    created: AlterationStamp!
    modified: AlterationStamp
  }
`;

export { resolver, typeDef };
