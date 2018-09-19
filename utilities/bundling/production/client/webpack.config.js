const AssetsPlugin = require('assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');
// const webpack = require('webpack');

const babelOptions = require('../babelOptions');

const cwd = process.cwd();

module.exports = {
  mode: 'production',
  entry: {
    app: './src/client/index.jsx'
  },
  resolve: {
    extensions: [
      '.webpack.js',
      '.web.js',
      '.js',
      '.ts',
      '.tsx',
      '.json',
      '.jsx'
    ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions
          },
          'awesome-typescript-loader'
        ]
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
    new CheckerPlugin(),
    new AssetsPlugin(),
    new CleanWebpackPlugin(['dist', 'public'], {
      root: cwd
    })
    // new webpack.HotModuleReplacementPlugin({ quiet: true })
  ],
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(cwd, 'public'),
    publicPath: '/'
  }
};
