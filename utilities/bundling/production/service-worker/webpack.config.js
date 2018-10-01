// const CleanWebpackPlugin = require('clean-webpack-plugin');
// const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');

const babelOptions = require('../babelOptions');
const webpackAssets = require('../../../../webpack-assets.json');

babelOptions.presets = [];
babelOptions.presets.unshift([
  '@babel/preset-env',
  {
    targets: {
      browsers: ['last 2 versions', 'safari >= 7']
    }
  }
]);

const assets = Object.values(webpackAssets).reduce(
  (p, c) => [...p, ...Object.values(c)],
  []
);

module.exports = {
  mode: 'production',
  target: 'webworker',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: babelOptions
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __ASSETS__: JSON.stringify(assets),
      __SW_PREFIX__: '"(inside Service-Worker) "'
    }),
    new webpack.ExtendedAPIPlugin()
  ],
  output: {
    filename: 'sw.js',
    path: path.resolve(process.cwd(), 'public')
  }
};
