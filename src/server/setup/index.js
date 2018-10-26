/* eslint-disable no-console*/
import fetch from 'node-fetch';
import fs from 'fs';
import { COOKIE_TYPE_MAP } from '../../common/types';

const __INTROSPECTION__ = process.env.INTROSPECT_GRAPHQL_SCHEMA;
export default async app => {
  if (__INTROSPECTION__) {
    const data = require('../../../fragmentTypes.json');
    app.set('fragments', data);
    return;
  }
  const [csurf, cookie] = await fetch(
    `http://localhost:${app.get('port')}/csurf`
  )
    .then(async result => [
      await result.json(),
      result.headers.get('set-cookie')
    ])
    .catch(() => {
      return ['sdas', '_csurf=asdfdasf'];
    });
  await fetch(`http://localhost:${app.get('port')}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      [COOKIE_TYPE_MAP.csurfToken]: csurf,
      cookie
    },
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
