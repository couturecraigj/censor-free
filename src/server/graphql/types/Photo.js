import { gql } from 'apollo-server';
import Photo from '../../models/photo';

const resolver = {
  img: async photo => Photo.findById(photo.img)
};

const typeDef = gql`
  type Photo implements Node & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    title: String! @index(type: "text")
    description: String! @index(type: "text")
    comments: [Comment]!
    height: Int
    width: Int
    imgUri: String!
    created: AlterationStamp!
    modified: AlterationStamp
  }
`;

export { resolver, typeDef };
