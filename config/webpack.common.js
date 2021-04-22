const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const paths = require('./paths');

module.exports = {
  resolve: {
    extensions: ['.js', '.scss'],
  },
  entry: {
    banner: './src/js/banner',
    baseInfo: './src/js/baseInfo',
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: ['babel-loader'] },
      { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },
      { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.static,
          to: 'assets',
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: paths.src + '/template/banner.html',
      filename: 'banner.html',
      chunks: ['banner'],
    }),
    new HtmlWebpackPlugin({
      template: paths.src + '/template/baseInfo.html',
      filename: 'baseInfo.html',
      chunks: ['baseInfo'],
    }),
  ],
};
