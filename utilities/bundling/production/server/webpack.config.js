const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

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
    extensions: ['.webpack.js', '.web.js', '.js', '.json', '.jsx']
  },
  module: {
    rules: [
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
              'dynamic-import-node',
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              // "@babel/plugin-transform-runtime",
              // "react-hot-loader/babel",
              'loadable-components/babel'
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist', 'server'], {
      root: cwd
    })
  ],
  target: 'node',
  externals: [nodeExternals()]
};
