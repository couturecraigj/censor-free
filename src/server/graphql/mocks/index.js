const casual = require('casual');

const range = size => [...Array(size).keys()];
const unionInterface = (mockMap, list) => {
  return mockMap[list[casual.integer(0, list.length - 1)]](casual.uuid);
};
const mocks = {
  Id: () => Math.random(),
  Int: () => casual.integer(-1000, 1000),
  Float: () => casual.double(-1000, 1000),
  String: () => casual.string,
  Thought: () => ({
    id: 'Thought' + casual.uuid,
    title: casual.title,
    description: casual.description,
    __typename: 'Thought'
  }),
  Group: () => ({
    id: 'Group' + casual.uuid,
    title: casual.title,
    description: casual.description,
    __typename: 'Group'
  }),
  Comment: () => ({
    id: 'Comment' + casual.uuid,
    title: casual.title,
    description: casual.description,
    __typename: 'Comment'
  }),
  Query: () => ({
    feed: () => range(20).map(mocks.PostUnion),
    saved: () => range(50).map(mocks.Save),
    company: ({ id = casual.uuid }) => mocks.Company(id),
    companies: () => range(40).map(() => mocks.Company(casual.uuid)),
    product: ({ id = casual.uuid }) => mocks.Product(id),
    products: () => range(40).map(() => mocks.Product(casual.uuid)),
    group: ({ id = casual.uuid }) => mocks.Group(id),
    groups: () => range(40).map(() => mocks.Group(casual.uuid)),
    user: ({ id = casual.uuid }) => mocks.User(id),
    users: () => range(40).map(() => mocks.User(casual.uuid)),
    video: ({ id = casual.uuid }) => mocks.Video(id),
    videos: () => range(40).map(() => mocks.Video(casual.uuid)),
    search: () => range(40).map(() => mocks.Searchable(casual.uuid))
  }),
  PostUnion: () =>
    unionInterface(mocks, [
      'Thought',
      'Review',
      'Question',
      'Answer',
      'Image',
      'Video',
      'WebPage',
      'Tip'
    ]),
  Searchable: () =>
    unionInterface(mocks, [
      'Thought',
      'Review',
      'Question',
      'Comment',
      'Group',
      'Product',
      'Company',
      'User',
      'Answer',
      'Image',
      'Video',
      'WebPage',
      'Tip'
    ]),
  Save: () => ({
    id: casual.uuid,
    imgUri: `https://via.placeholder.com/${casual.integer(
      20,
      400
    )}x${casual.integer(20, 400)}`,
    objectId: casual.uuid,
    object: () =>
      unionInterface(mocks, ['Product', 'Company', 'WebPage', 'Image', 'Video'])
  }),
  SavedRecord: obj => ({
    id: obj.objectId || casual.uuid,
    __typename: 'SavedRecord'
  }),
  Review: obj => ({
    __typename: 'Review',
    id: 'Review' + (obj.objectId || casual.uuid),
    name: casual.title,
    description: casual.description,
    score: casual.double(0, 5)
  }),
  Question: obj => ({
    __typename: 'Question',
    id: 'Question' + (obj.objectId || casual.uuid),
    name: casual.title,
    description: casual.description
  }),
  Tip: obj => ({
    __typename: 'Tip',
    id: 'Tip' + (obj.objectId || casual.uuid),
    name: casual.title,
    description: casual.description
  }),
  Answer: obj => ({
    __typename: 'Answer',
    id: 'Answer' + (obj.objectId || casual.uuid),
    name: casual.title,
    description: casual.description
  }),
  Product: obj => ({
    __typename: 'Product',
    id: 'Product' + (obj.objectId || casual.uuid),
    imgUri: `https://picsum.photos/${casual.integer(30, 500)}/${casual.integer(
      30,
      500
    )}/?random`,
    name: casual.title,
    description: casual.description
  }),
  User: obj => ({
    __typename: 'User',
    id: 'User' + (obj.objectId || casual.uuid),
    name: casual.full_name,
    description: casual.description
  }),
  Company: obj => ({
    __typename: 'Company',
    id: 'Company' + (obj.objectId || casual.uuid),
    name: casual.title,
    description: casual.description
  }),
  WebPage: obj => ({
    __typename: 'WebPage',
    id: 'WebPage' + (obj.objectId || casual.uuid),
    title: casual.title,
    description: casual.description
  }),
  Image: obj => {
    const height = casual.integer(30, 500);
    const width = casual.integer(30, 500);
    return {
      __typename: 'Image',
      id: 'Image' + (obj.objectId || casual.uuid),
      imgUri: `https://picsum.photos/${height}/${width}/?random`,
      title: casual.title,
      height,
      width,
      description: casual.description
    };
  },
  Video: obj => ({
    __typename: 'Video',
    id: 'Video' + (obj.objectId || casual.uuid),
    title: casual.title,
    description: casual.description
  })
};

module.exports = mocks;
