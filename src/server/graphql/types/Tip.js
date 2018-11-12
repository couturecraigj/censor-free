import { gql } from 'apollo-server';
import Photo from '../../models/photo';

const resolver = {
  img: async company => Photo.findById(company.img)
};

const typeDef = gql`
  type Tip implements Node & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    title: String! @index(type: "text")
    description: String! @index(type: "text")
    products: [Product!]
    comments: [Comment]!
    created: AlterationStamp!
    modified: AlterationStamp
  }
`;

export { resolver, typeDef };
