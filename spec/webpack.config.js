"use strict";

const applicationConfigs = require("../webpack.config.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = () => {
  const configs = [];
  configs.push({
    entry: ["mocha-loader!./spec/index.js"],
    devServer: {
      host: "localhost"
    },
    devtool: "inline-sourcemap",
    plugins: [
      new HtmlWebpackPlugin({
        filename: "specs.html"
      }),
      new webpack.DefinePlugin({
        "process.env.TOKEN_SECRET": "123"
      })
    ],
    module: {
      rules: [{
        test: /\.js/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }]
    }
  });
  configs.push(...applicationConfigs);
  return configs;
};
