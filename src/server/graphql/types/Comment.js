import { gql } from 'apollo-server';
import Photo from '../../models/photo';

const resolver = {
  img: async company => Photo.findById(company.img)
};

const typeDef = gql`
  type Comment implements Node & CommentNode {
    id: ID!
    highlights: [Highlight]!
    parent: PostNode!
    description: String! @index(type: "text")
    created: AlterationStamp!
    modified: AlterationStamp
  }
`;

export { resolver, typeDef };
