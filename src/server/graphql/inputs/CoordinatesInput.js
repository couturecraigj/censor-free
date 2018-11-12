import { gql } from 'apollo-server';

const typeDef = gql`
  input CoordinatesInput {
    fromTop: Int!
    fromLeft: Int!
    height: Int!
    width: Int!
    startTimeCode: Int
    endTimeCode: Int
  }
`;

export default typeDef;
