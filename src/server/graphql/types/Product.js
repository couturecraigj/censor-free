import { gql } from 'apollo-server';
import Photo from '../../models/photo';

const resolver = {
  img: async product => Photo.findById(product.img)
};

const typeDef = gql`
  type Product implements Node & Object & Searchable {
    id: ID!
    highlights: [Highlight]!
    name: String! @index(type: "text")
    slug: String! @unique
    description: String! @index(type: "text")
    img: Photo
    imgs: [Photo]
    created: AlterationStamp!
    modified: AlterationStamp
  }
`;

export { resolver, typeDef };
