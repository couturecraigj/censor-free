const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/client/index.js"
  },
  devServer: {
    contentBase: "./dist",
    headers: { "Access-Control-Allow-Origin": "http://localhost:3000" },
    hot: true
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
              "@babel/plugin-syntax-dynamic-import",
              "react-hot-loader/babel"
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["public"], {
      root: process.cwd()
    }),
    new webpack.HotModuleReplacementPlugin({ quiet: true })
  ],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "http://localhost:8080/"
  }
};
