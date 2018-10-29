import fs from 'fs';
import path from 'path';

const cwd = process.cwd();
const publicDir = path.join(cwd, 'public');
const makeDirectory = route =>
  new Promise((resolve, reject) => {
    try {
      const directoryArray = route.replace(publicDir, '').split(path.sep);

      directoryArray.reduce((p, c) => {
        const dir = path.join(p, c);

        if (!fs.existsSync(dir)) fs.mkdirSync(dir);

        return dir;
      }, publicDir);
      resolve(directoryArray);
    } catch (error) {
      reject(error);
    }
  });

const doSomethingElse = () => {};

export { makeDirectory, doSomethingElse };
