import { gql } from 'apollo-server';
import Photo from '../../models/photo';
import User from '../../models/user';

const resolver = {
  img: async user => {
    const photo = await Photo.findById(user.img);

    if (photo) return photo;

    return User.getGravatarPhoto(user);
  }
};

const typeDef = gql`
  type User implements Node & Searchable & UserNode {
    id: ID!
    highlights: [Highlight]!
    userName: String! @index(type: "text") @unique
    email: String! @index(type: "text") @unique @lowerCase
    img: Photo
    imgs: [Photo]
  }
`;

export { resolver, typeDef };
