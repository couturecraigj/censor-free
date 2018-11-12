import { gql } from 'apollo-server';
import Photo from '../../models/photo';

const resolver = {
  img: async company => Photo.findById(company.img)
};

const typeDef = gql`
  type Video implements Node & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    converted: Boolean
    title: String! @index(type: "text")
    description: String! @index(type: "text")
    imgs: [Photo]
    comments: [Comment]!
    img: Photo
    uri: String!
    created: AlterationStamp!
    modified: AlterationStamp
  }
`;

export { resolver, typeDef };
