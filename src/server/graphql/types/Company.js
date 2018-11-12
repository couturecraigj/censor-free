import { gql } from 'apollo-server';
import Photo from '../../models/photo';

const resolver = {
  img: async company => Photo.findById(company.img)
};

const typeDef = gql`
  type Company implements Node & Object & Searchable {
    id: ID!
    highlights: [Highlight]!
    slug: String! @unique
    name: String! @index(type: "text")
    img: Photo
    imgs: [Photo]
    description: String! @index(type: "text")
    created: AlterationStamp!
    modified: AlterationStamp
  }
`;

export { resolver, typeDef };
