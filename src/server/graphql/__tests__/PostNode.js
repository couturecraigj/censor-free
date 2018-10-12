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
    resolvers,
    logger: {
      // eslint-disable-next-line no-console
      log: console.log
    },
    context: () => ({
      // authScope: getScope(req.headers.authorization)
      // db: req.db,
      // res,
      // req
    })
  });
  return graphql(schema, query).then(result => {
    if (result.errors) throw result.errors;
    return result;
  });
};

describe('PostNode', () => {
  beforeAll(async () => {
    mongoose.connect('mongodb://mongo:27017/no_censor');
  });
  afterEach(() => {
    mongoose.clearMockedResults();
  });
  it('should allow querying `feed` to get PostNode', async () => {
    mongoose.mockResult('PostNode', 'find', [{ kind: 'Question', post: 123 }]);
    await expect(
      execute(`{
      feed {
        id
      }
    }`)
    ).resolves.toEqual({ data: { feed: [] } });
  });
  it('should provide a list if everything matches', async () => {
    mongoose.mockResult('PostNode', 'find', [{ kind: 'Story', post: '123' }]);
    mongoose.mockResult(
      'Story',
      'findById',
      { title: 'Story', id: '123' },
      '123'
    );
    await expect(
      execute(`{
      feed {
        id
        title
      }
    }`)
    ).resolves.toEqual({ data: { feed: [{ title: 'Story', id: '123' }] } });
  });
});
