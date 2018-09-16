// import path from 'path';
const MemoryFs = require('memory-fs');
const webpack = require('webpack');

module.exports = (config, memory = true) => {
  const compiler = webpack(config);
  let fs;
  if (memory) {
    fs = new MemoryFs();
    compiler.outputFileSystem = fs;
  } else {
    fs = compiler.outputFileSystem;
  }

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);

      resolve([stats, fs]);
    });
  });
};
