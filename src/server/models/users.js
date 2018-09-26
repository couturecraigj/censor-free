module.exports = async db => {
  const userSchema = {
    title: 'user schema',
    description: 'describes a simple user',
    version: 0,
    type: 'object',
    properties: {
      name: {
        type: 'string',
        primary: true
      },
      color: {
        type: 'string'
      }
    },
    required: ['color']
  };
  await db.collection({
    name: 'users',
    schema: userSchema
    // statics: {
    //   // async addUser(name, color) {
    //   //   return this.upsert({
    //   //     name,
    //   //     color
    //   //   });
    //   // }
    // }
  });
  // db.collections.users.sync();
  return db;
};
