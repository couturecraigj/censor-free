/* eslint-disable no-console*/
const fetch = require('node-fetch');
const fs = require('fs');
const { ApolloServer } = require('apollo-server');

const resolvers = require('../../src/server/graphql/resolvers');
const typeDefs = require('../../src/server/graphql/typeDefs');

const server = new ApolloServer({
  typeDefs,
  resolvers
});
server.listen().then(({ url, server }) => {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      variables: {},
      operationName: '',
      query: `
        {
          __schema {
            types {
              kind
              name
              possibleTypes {
                name
              }
            }
          }
        }
      `
    })
  })
    .then(result => result.json())
    .then(result => {
      // here we're filtering out any type information unrelated to unions or interfaces
      if (!result.data) throw result;
      try {
        const filteredData = result.data.__schema.types.filter(
          type => type.possibleTypes !== null
        );

        result.data.__schema.types = filteredData;
        fs.writeFile(
          './fragmentTypes.json',
          JSON.stringify(result.data),
          err => {
            if (err) {
              console.error('Error writing fragmentTypes file', err);
            } else {
              if (!fs.existsSync('./public')) {
                // Do something
                fs.mkdirSync('./public');
              }
              fs.writeFile(
                './public/fragmentTypes.json',
                JSON.stringify(result.data),
                err => {
                  if (err) {
                    console.error('Error writing fragmentTypes file', err);
                  } else {
                    console.log('Fragment types successfully extracted!');
                    // eslint-disable-next-line no-process-exit
                    server.close();
                  }
                }
              );
            }
          }
        );
      } catch (e) {
        throw e;
      }
    })
    .catch(console.error);
});
