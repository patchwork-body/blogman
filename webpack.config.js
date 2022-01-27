const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path/posix');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',

  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({ template: path.resolve(path.join(process.cwd(), 'index.html')) }),
  ],

  devServer: {
    hot: true,
    port: 10100,
  },
};
