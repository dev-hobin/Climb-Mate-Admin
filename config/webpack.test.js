const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const paths = require('./paths');

module.exports = merge(common, {
  mode: 'production',
  target: 'browserslist',
  devtool: false,
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
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/testWeb/admin/assets/',
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: paths.src + '/prodTemplate/login.html',
      templateParameters: {
        path: '/testWeb/admin/',
      },
      filename: 'login.html',
      chunks: ['login'],
    }),
    new HtmlWebpackPlugin({
      template: paths.src + '/prodTemplate/banner.html',
      templateParameters: {
        path: '/testWeb/admin/',
      },
      filename: 'banner.html',
      chunks: ['banner'],
    }),
    new HtmlWebpackPlugin({
      template: paths.src + '/prodTemplate/baseInfo.html',
      templateParameters: {
        path: '/testWeb/admin/',
      },
      filename: 'baseInfo.html',
      chunks: ['baseInfo'],
    }),
    new HtmlWebpackPlugin({
      template: paths.src + '/prodTemplate/detailInfo.html',
      templateParameters: {
        path: '/testWeb/admin/',
      },
      filename: 'detailInfo.html',
      chunks: ['detailInfo'],
    }),
    new HtmlWebpackPlugin({
      template: paths.src + '/prodTemplate/price.html',
      templateParameters: {
        path: '/testWeb/admin/',
      },
      filename: 'price.html',
      chunks: ['price'],
    }),
    new HtmlWebpackPlugin({
      template: paths.src + '/prodTemplate/setting.html',
      templateParameters: {
        path: '/testWeb/admin/',
      },
      filename: 'setting.html',
      chunks: ['setting'],
    }),
    new HtmlWebpackPlugin({
      template: paths.src + '/prodTemplate/level.html',
      templateParameters: {
        path: '/testWeb/admin/',
      },
      filename: 'level.html',
      chunks: ['level'],
    }),
  ],
  output: {
    path: paths.output.test,
    filename: 'js/[name]_bundle.[contenthash].js',
    publicPath: '/testWeb/admin/',
    assetModuleFilename: 'assets/[hash][ext][query]',
  },
  optimization: {
    minimize: true,
  },
});
