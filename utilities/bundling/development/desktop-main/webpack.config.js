const CleanWebpackPlugin = require('clean-webpack-plugin');
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
    // serverWorker: './src/server-worker/index.js',
    main: './src/desktop-app/main/index.js',
    mainScript: './src/desktop-app/renderer/index.js'
  },
  mode: 'development',
  output: {
    filename: '[name].js',
    path: path.resolve(cwd, 'desktop-app'),
    publicPath: 'file://' + cwd + '/desktop-app/'
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
  // stats: 'errors-only',
  devServer: {
    contentBase: './dist',
    // open: true,
    public: path.join('file:/', cwd),
    // clientLogLevel: 'warning',
    noInfo: true,
    overlay: {
      warnings: true,
      errors: true
    },
    // quiet: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept'
    },
    hot: true,
    stats: 'errors-only'
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
        test: /\.html$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'file-loader'
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components|server-worker)/,
        use: {
          loader: 'babel-loader',
          options: babelOptions
        }
      }
    ]
  },
  plugins: [
    new CheckerPlugin(),
    new CleanWebpackPlugin(['desktop-app'], {
      root: process.cwd(),
      // watch: true,
      verbose: false
    }),
    // new webpack.DefinePlugin({
    //   'process.env.INTROSPECT_GRAPHQL_SCHEMA': JSON.stringify(
    //     process.env.NODE_ENV === 'production'
    //   )
    // }),
    new webpack.BannerPlugin({
      banner: "require('source-map-support').install();"
    }),
    new Dotenv({
      path: './.env.development',
      silent: true
    })
  ],
  target: 'electron-main',
  externals: [nodeExternals()]
};
