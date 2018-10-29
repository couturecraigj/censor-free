// const CleanWebpackPlugin = require('clean-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

// const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

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

const cwd = process.cwd();

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    main: './src/desktop-app/main/index.js',
    mainScript: './src/desktop-app/renderer/index.js'
  },
  mode: 'development',
  output: {
    filename: '[name].js',
    path: path.resolve(cwd, 'desktop-app')
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
  module: {
    rules: [
      // {
      //   enforce: 'pre',
      //   test: /\.jsx?$/,
      //   exclude: /(node_modules|bower_components)/,
      //   loader: 'eslint-loader'
      // },
      // {
      //   test: /\.jsx?$/,
      //   exclude: /(node_modules|bower_components|server-worker)/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: babelOptions
      //   }
      // },
      // {
      //   test: /\.html$/,
      //   exclude: /(node_modules|bower_components)/,
      //   use: {
      //     loader: 'file-loader'
      //   }
      // }
    ]
  },
  plugins: [
    new WriteFilePlugin()
    // new Dotenv({
    //   path: './.env.development',
    //   silent: true
    // })
  ],
  target: 'electron-main',
  externals: [nodeExternals()]
};
