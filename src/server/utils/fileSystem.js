import fs from 'fs';
import path from 'path';

const makeDirectory = route => {
  const directoryArray = route.split('/').filter(v => v);
  directoryArray.reduce((p, c) => {
    const dir = path.join(p, c);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    return dir;
  }, path.join(process.cwd(), 'public'));
  return directoryArray;
};

const doSomethingElse = () => {};

export { makeDirectory, doSomethingElse };
