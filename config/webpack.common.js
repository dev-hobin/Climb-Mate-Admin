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
    detailInfo: './src/js/detailInfo',
    price: './src/js/price',
    setting: './src/js/setting',
    notice: './src/js/notice',
    noticeInfo: './src/js/noticeInfo',
    level: './src/js/level',
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
    new HtmlWebpackPlugin({
      template: paths.src + '/template/detailInfo.html',
      filename: 'detailInfo.html',
      chunks: ['detailInfo'],
    }),
    new HtmlWebpackPlugin({
      template: paths.src + '/template/price.html',
      filename: 'price.html',
      chunks: ['price'],
    }),
    new HtmlWebpackPlugin({
      template: paths.src + '/template/setting.html',
      filename: 'setting.html',
      chunks: ['setting'],
    }),
    new HtmlWebpackPlugin({
      template: paths.src + '/template/notice.html',
      filename: 'notice.html',
      chunks: ['notice'],
    }),
    new HtmlWebpackPlugin({
      template: paths.src + '/template/noticeInfo.html',
      filename: 'noticeInfo.html',
      chunks: ['noticeInfo'],
    }),
    new HtmlWebpackPlugin({
      template: paths.src + '/template/level.html',
      filename: 'level.html',
      chunks: ['level'],
    }),
  ],
};
