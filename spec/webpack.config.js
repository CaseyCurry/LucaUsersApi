"use strict";

const applicationConfigs = require("../webpack.config.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const serviceRegistry = require("luca-service-registry-library");

module.exports = () => {
  const statusCheckPollDuration = 15;
  return serviceRegistry.register("users-api-specs", statusCheckPollDuration)
    .then(port => {
      const configs = [];
      configs.push({
        entry: ["mocha-loader!./spec/index.js"],
        devServer: {
          host: "localhost",
          port: port
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
            exclude: [/node_modules/],
            use: [{
              loader: "babel-loader"
            }]
          }]
        }
      });
      configs.push(...applicationConfigs);
      return configs;
    })
    .catch(error => {
      console.log(error);
    });
};
