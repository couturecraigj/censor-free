const CleanWebpackPlugin = require('clean-webpack-plugin');

const common = require('.');

module.exports = {
  ...common,
  entry: {
    app: './src/client/index.jsx'
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
        test: /\.tsx?$/,
        use: ['babel-loader', 'awesome-typescript-loader']
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              // ["@babel/plugin-proposal-decorators", { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              // "@babel/plugin-syntax-dynamic-import",
              '@babel/plugin-transform-runtime',
              'loadable-components/babel',
              'react-hot-loader/babel'
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['public'], {
      root: process.cwd()
    })
  ]
};
