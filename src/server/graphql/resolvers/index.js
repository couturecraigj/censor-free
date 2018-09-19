const resolvers = {
  Query: {
    hello: () => 'Hello world!'
  },
  Post: {}
  // Save: {
  //   object: {
  //     __resolveType() {
  //       // obj, context, info
  //       return 'Product';

  //       // return null;
  //     }
  //   }
  // }
  // SavedRecord: {
  //   __resolveType() {
  //     // obj, context, info
  //     //
  //     return 'Product';

  //     // return null;
  //   }
  // },
  // Node: {
  //   __resolveType() {
  //     // obj, context, info
  //     //
  //     return 'Product';

  //     // return null;
  //   }
  // }
};

module.exports = resolvers;
