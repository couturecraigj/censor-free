/* env: jest */
import mongoose from 'mongoose';
import '../../models/postNode';
import { makeExecutableSchema } from 'apollo-server';
import { graphql } from 'graphql';
import typeDefs from '../typeDefs';
import resolvers from '../resolvers';

const execute = query => {
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
    // logger: {
    //   // eslint-disable-next-line no-console
    //   log: console.log
    // }
  });
  return graphql(schema, query, undefined, {
    res: {
      cookie: jest.fn()
    }
  }).then(result => {
    if (result.errors) throw result.errors;
    return result;
  });
};

describe('Authentication', () => {
  beforeAll(async () => {
    mongoose.connect('mongodb://mongo:27017/no_censor');
  });
  afterEach(() => {
    mongoose.clearMockedResults();
  });
  it('should Allow `login`', async () => {
    mongoose.mockResult(
      'User',
      'findOne',
      {
        id: 'Question',
        password: 'password',
        passwordsMatch(pass) {
          return pass === this.password;
        }
      },
      {
        $or: [{ userName: 'moosecouture' }, { email: 'moosecouture' }]
      }
    );
    await expect(
      execute(`mutation {
      logIn(nameEmail: "moosecouture", password: "password") {
        token
      }
    }`)
    ).resolves.toEqual({
      data: {
        logIn: {
          token: 'Question'
        }
      }
    });
  });
});
