const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const common = require('.');

common.plugins.unshift(
  new CleanWebpackPlugin(['server', 'dist'], {
    root: process.cwd()
  })
);
module.exports = {
  ...common,
  target: 'node',
  externals: [nodeExternals()]
};
