const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');

const babelOptions = require('../babelOptions');

babelOptions.plugins.unshift('dynamic-import-node');
babelOptions.presets.unshift([
  '@babel/preset-env',
  {
    targets: {
      node: 'current'
    }
  }
]);
const cwd = process.cwd();

module.exports = {
  entry: {
    index: './src/server/index.jsx'
  },
  mode: 'production',
  output: {
    filename: '[name].[id].js',
    path: path.resolve(cwd, 'server')
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
    new CleanWebpackPlugin(['dist', 'server'], {
      root: cwd
    })
  ],
  target: 'node',
  externals: [nodeExternals()]
};
