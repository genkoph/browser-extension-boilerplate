const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const sourcePath = path.resolve("src");
const buildPath = path.resolve("build");
const publicPath = path.resolve('public');

module.exports = {
  entry: {
    popup: path.join(sourcePath, "popup", "index.tsx"),
    options: path.join(sourcePath, "options", "index.tsx"),
    background: path.join(sourcePath, "background", "index.ts"),
    contentScript: path.join(sourcePath, "content-script", "index.ts"),
  },

  output: {
    path: buildPath,
    filename: "[name].bundle.js",
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },

  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial',
    },
  },

  plugins: [
    /**
     * Copy static files to the build directory
     */
    new CopyPlugin({
      patterns: [
        { from: publicPath, to: buildPath }
      ]
    }),

    /**
     * All files inside webpack's output.path directory
     * will be removed on every re-bundle
     */
    new CleanWebpackPlugin()
  ]
};
