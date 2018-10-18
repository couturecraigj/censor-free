const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const TodoWebpackPlugin = require('todo-webpack-plugin');
const webpack = require('webpack');
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
    noInfo: true,
    color: true
    // contentBase: './dist',
  },
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
    new TodoWebpackPlugin({
      console: true,
      reporter: 'markdown',
      filename: 'TODO.md'
    }),
    new CheckerPlugin(),
    new CleanWebpackPlugin(['server', 'dist'], {
      root: process.cwd(),
      // watch: true,
      verbose: false
    }),
    new webpack.DefinePlugin({
      'process.env.INTROSPECT_GRAPHQL_SCHEMA': JSON.stringify(
        process.env.NODE_ENV === 'production'
      )
    }),
    new webpack.BannerPlugin({
      banner: "require('source-map-support').install();"
    })
  ],
  target: 'node',
  externals: [nodeExternals()]
};
