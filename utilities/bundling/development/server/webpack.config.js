const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const { CheckerPlugin } = require('awesome-typescript-loader');
// const path = require('path');

const babelOptions = require('../babelOptions');

babelOptions.presets.unshift([
  '@babel/preset-env',
  {
    targets: {
      node: 'current'
    }
  }
]);

babelOptions.plugins.unshift('dynamic-import-node');

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    index: './src/server/dev.js'
  },
  mode: 'development',
  output: {
    filename: '[name].js'
  },
  resolve: {
    extensions: [
      '.webpack.js',
      '.web.js',
      '.js',
      '.ts',
      '/index.ts',
      '/index.tsx',
      '.tsx',
      '.json',
      '.jsx'
    ]
  },
  stats: 'errors-only',
  devServer: {
    noInfo: true
    // contentBase: './dist',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.[jt]sx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'eslint-loader'
      },
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
    new CleanWebpackPlugin(['server', 'dist'], {
      root: process.cwd()
    })
  ],
  target: 'node',
  externals: [nodeExternals()]
};
