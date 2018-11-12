import { gql } from 'apollo-server';
import Photo from '../../models/photo';

const resolver = {
  img: async company => Photo.findById(company.img)
};

const typeDef = gql`
  type Group implements Node & Searchable {
    id: ID!
    highlights: [Highlight]!
    title: String! @index(type: "text")
    description: String! @index(type: "text")
    img: Photo
    imgs: [Photo]
  }
`;

export { resolver, typeDef };
