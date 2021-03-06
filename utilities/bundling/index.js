const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/client/index.jsx'
  },
  devServer: {
    contentBase: './dist',
    noInfo: true,
    // quiet: true,
    headers: { 'Access-Control-Allow-Origin': 'http://localhost:3000' },
    hot: true,
    stats: 'errors-only'
  },
  resolve: {
    extensions: [
      '.webpack.js',
      '.web.js',
      '.js',
      '.json',
      '.ts',
      '.tsx',
      '.jsx'
    ]
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
    new CheckerPlugin()
    // new webpack.HotModuleReplacementPlugin({ quiet: true })
  ]
};
