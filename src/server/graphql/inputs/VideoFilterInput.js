import { gql } from 'apollo-server';

const typeDef = gql`
  input VideoFilterInput {
    type: FILTER_ENUM
    startTimeCode: Int!
    endTimeCode: Int!
    width: Int
    height: Int
    coordinates: CoordinatesInput
  }
`;

export default typeDef;
