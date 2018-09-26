const AssetsPlugin = require('assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const { CheckerPlugin } = require('awesome-typescript-loader');
// const webpack = require('webpack');

const babelOptions = require('../babelOptions');

babelOptions.presets.unshift([
  '@babel/preset-env',
  {
    targets: {
      browsers: ['last 2 versions', 'safari >= 7']
    },
    modules: false
  }
]);
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
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all'
  //   }
  // },
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
    }),
    new webpack.DefinePlugin({
      'process.env.INTROSPECT_GRAPHQL_SCHEMA': JSON.stringify(
        process.env.NODE_ENV === 'production'
      ),
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(cwd, 'public'),
    publicPath: '/'
  }
};
