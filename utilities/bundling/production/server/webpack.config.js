const CleanWebpackPlugin = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const path = require("path");
const cwd = process.cwd();

module.exports = {
  entry: {
    index: "./src/server/index.js"
  },
  mode: "production",
  output: {
    filename: "[name].[id].js",
    path: path.resolve(cwd, "server")
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
              "dynamic-import-node",
              ["@babel/plugin-proposal-class-properties", { loose: true }],
              "loadable-components/babel"
              // "react-hot-loader/babel"
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["dist", "server"], {
      root: cwd
    })
  ],
  target: "node",
  externals: [nodeExternals()]
};
