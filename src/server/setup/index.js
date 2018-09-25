/* eslint-disable no-console*/
const fetch = require('node-fetch');
const fs = require('fs');

const __INTROSPECTION__ = process.env.INTROSPECT_GRAPHQL_SCHEMA;
module.exports = app => {
  if (__INTROSPECTION__) {
    const data = require('../../../webpack-assets.json');
    app.set('fragments', data);
    return;
  }
  fetch(`http://localhost:${app.get('port')}/graphql`, {
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
        app.set('fragments', result.data);
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
            }
          }
        );
      } catch (e) {
        throw e;
      }
    })
    .catch(console.error);
};
