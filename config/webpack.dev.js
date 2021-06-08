const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const paths = require('./paths');

module.exports = merge(common, {
  mode: 'development',
  target: 'web',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: paths.output.dev,
    hot: true,
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/login.html' },
        { from: /^\/banner/, to: '/banner.html' },
        { from: /^\/baseInfo/, to: '/baseInfo.html' },
        { from: /^\/detailInfo/, to: '/detailInfo.html' },
        { from: /^\/level/, to: '/level.html' },
        { from: /^\/login/, to: '/login.html' },
        { from: /^\/price/, to: '/price.html' },
        { from: /^\/setting/, to: '/setting.html' },
      ],
    },
  },

  entry: {
    login: paths.src + '/js/login',
    banner: paths.src + '/js/banner',
    baseInfo: paths.src + '/js/baseInfo',
    detailInfo: paths.src + '/js/detailInfo',
    price: paths.src + '/js/price',
    setting: paths.src + '/js/setting',
    level: paths.src + '/js/level',
  },

  module: {
    rules: [
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: paths.src + '/template/login.html',
      filename: 'login.html',
      chunks: ['login'],
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
      template: paths.src + '/template/level.html',
      filename: 'level.html',
      chunks: ['level'],
    }),
  ],
  output: {
    path: paths.output.dev,
    filename: 'js/[name]_bundle.[contenthash].js',
    assetModuleFilename: 'assets/[hash][ext][query]',
  },
});
