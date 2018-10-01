// const CleanWebpackPlugin = require('clean-webpack-plugin');
// const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');

const babelOptions = require('../babelOptions');

babelOptions.presets = [];
babelOptions.presets.unshift([
  '@babel/preset-env',
  {
    targets: {
      browsers: ['last 2 versions', 'safari >= 7']
    }
  }
]);

const assets = [];

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  stats: 'errors-only',
  target: 'webworker',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'eslint-loader'
      },
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
