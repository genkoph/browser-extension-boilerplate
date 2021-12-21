const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const sourcePath = path.resolve("src");
const buildPath = path.resolve("build");
const publicPath = path.resolve('public');
const viewsPath = path.join(publicPath, 'views');

module.exports = {
  entry: {
    popup: path.join(sourcePath, "popup", "index.tsx"),
    options: path.join(sourcePath, "options", "index.tsx"),
    background: path.join(sourcePath, "background", "index.ts"),
    contentScript: path.join(sourcePath, "content-script", "index.ts"),
  },

  output: {
    path: buildPath,
    filename: "assets/scripts/[name].bundle.js",
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
        { from: publicPath, to: buildPath, globOptions: { ignore: ['**/views/**']} }
      ]
    }),

    /**
     * All files inside webpack's output.path directory
     * will be removed on every re-bundle
     */
    new CleanWebpackPlugin(),

    /**
     * Create html file for the popup document
     */
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, 'popup.html'),
      inject: 'body',
      chunks: ['popup'],
      filename: 'views/popup.html',
    }),

    /**
     * Create html file for the options document
     */
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, 'options.html'),
      inject: 'body',
      chunks: ['options'],
      filename: 'views/options.html',
    })
  ],
  
  devServer: {
    hot: true
  }
};
