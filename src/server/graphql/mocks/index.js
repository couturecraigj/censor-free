const casual = require('casual');

const range = size => [...Array(size).keys()];

const mocks = {
  Id: () => Math.random(),
  Int: () => casual.integer(-1000, 1000),
  Float: () => casual.double(-1000, 1000),
  String: () => casual.string,
  Post: () => ({
    id: casual.uuid,
    title: casual.title,
    description: casual.description
  }),
  Query: () => ({
    feed: () => range(20).map(mocks.PostUnion),
    saved: () => range(400).map(mocks.Save)
  }),
  PostUnion: () =>
    mocks[
      ['Post', 'Review', 'Question', 'Answer', 'Image', 'Video', 'WebPage'][
        casual.integer(0, 6)
      ]
    ](casual.uuid),
  Save: () => ({
    id: casual.uuid,
    imgUri: `https://via.placeholder.com/${casual.integer(
      20,
      400
    )}x${casual.integer(20, 400)}`,
    objectId: casual.uuid,
    object: () =>
      mocks[
        ['Product', 'Company', 'WebPage', 'Image', 'Video'][
          casual.integer(0, 4)
        ]
      ](casual.uuid)
    // object: {
    //   __typename: 'Product',
    //   title: casual.title,
    //   description: casual.description
    // }
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
    description: casual.description,
    score: casual.double(0, 5)
  }),
  Answer: obj => ({
    __typename: 'Answer',
    id: 'Answer' + (obj.objectId || casual.uuid),
    name: casual.title,
    description: casual.description,
    score: casual.double(0, 5)
  }),
  Product: obj => ({
    __typename: 'Product',
    id: 'Product' + (obj.objectId || casual.uuid),
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
  Image: obj => ({
    __typename: 'Image',
    id: 'Image' + (obj.objectId || casual.uuid),
    uri: `https://picsum.photos/${casual.integer(30, 500)}/${casual.integer(
      30,
      500
    )}/?random`,
    title: casual.title,
    description: casual.description
  }),
  Video: obj => ({
    __typename: 'Video',
    id: 'Video' + (obj.objectId || casual.uuid),
    title: casual.title,
    description: casual.description
  })
};

module.exports = mocks;
