import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue(value) {
    return new Date(value); // value from the client
  },
  serialize(value) {
    return value.getTime(); // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value); // ast value is always in string format
    }

    return null;
  }
});
const EmailScalar = new GraphQLScalarType({
  name: 'Email',
  description: 'This is where we can do custom email validation',
  parseValue(value) {
    return value.toLowerCase(); // value from the client
  },
  serialize(value) {
    return value; // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value); // ast value is always in string format
    }

    return null;
  }
});

export default {
  Date: DateScalar,
  Email: EmailScalar
};
