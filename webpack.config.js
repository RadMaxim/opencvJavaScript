const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = (env) => {
  console.log(path.resolve(__dirname, "index.js"), "dcdvdvd");
  
  return {
    devtool: false,
    // devtool: 'source-map',
    mode: env.mode ?? "production",
    entry: {
      filename: path.resolve(__dirname, "index.js"),
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index.js",
      clean: true,
    },

    devServer: {
      static: path.join(__dirname, "dist"),
      open: true,
      port: 8080,
      hot: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "./index.html"),
        filename: "index.html",
        minify: true,
      }),
      env.mode && new CleanWebpackPlugin(),
      new Dotenv(),
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
  };
};
