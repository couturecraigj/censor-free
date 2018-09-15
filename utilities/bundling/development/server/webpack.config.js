const CleanWebpackPlugin = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const path = require("path");

module.exports = {
  entry: {
    index: "./src/server/dev.js"
  },
  mode: "development",
  output: {
    filename: "[name].js"
  },
  resolve: {
    extensions: [".webpack.js", ".web.js", ".js", ".json", ".jsx"]
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: "eslint-loader"
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    node: "current",
                    esmodules: true
                  }
                }
              ],
              "@babel/preset-react"
            ],
            plugins: [
              // ["@babel/plugin-proposal-decorators", { legacy: true }],
              "dynamic-import-node",
              ["@babel/plugin-proposal-class-properties", { loose: true }],
              "react-hot-loader/babel",
              "loadable-components/babel"
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["server", "dist"], {
      root: process.cwd()
    })
  ],
  target: "node",
  externals: [nodeExternals()]
};
