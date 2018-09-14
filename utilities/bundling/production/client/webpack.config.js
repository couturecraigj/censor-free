const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const AssetsPlugin = require("assets-webpack-plugin");

const path = require("path");
const cwd = process.cwd();

module.exports = {
  mode: "production",
  entry: {
    app: "./src/client/index.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              // ["@babel/plugin-proposal-decorators", { legacy: true }],
              ["@babel/plugin-proposal-class-properties", { loose: true }],
              "react-hot-loader/babel"
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new AssetsPlugin(),
    new CleanWebpackPlugin(["dist", "public"], {
      root: cwd
    })
    // new webpack.HotModuleReplacementPlugin({ quiet: true })
  ],
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(cwd, "public"),
    publicPath: "/"
  }
};
