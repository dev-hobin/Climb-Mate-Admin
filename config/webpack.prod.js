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
    login: paths.src + '/prodjs/login',
    banner: paths.src + '/prodjs/banner',
    baseInfo: paths.src + '/prodjs/baseInfo',
    detailInfo: paths.src + '/prodjs/detailInfo',
    price: paths.src + '/prodjs/price',
    setting: paths.src + '/prodjs/setting',
    level: paths.src + '/prodjs/level',
  },

  module: {
    rules: [
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/web/admin/assets/',
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
        path: '/web/admin/',
      },
      filename: 'login.html',
      chunks: ['login'],
    }),
    new HtmlWebpackPlugin({
      template: paths.src + '/prodTemplate/banner.html',
      templateParameters: {
        path: '/web/admin/',
      },
      filename: 'banner.html',
      chunks: ['banner'],
    }),
    new HtmlWebpackPlugin({
      template: paths.src + '/prodTemplate/baseInfo.html',
      templateParameters: {
        path: '/web/admin/',
      },
      filename: 'baseInfo.html',
      chunks: ['baseInfo'],
    }),
    new HtmlWebpackPlugin({
      template: paths.src + '/prodTemplate/detailInfo.html',
      templateParameters: {
        path: '/web/admin/',
      },
      filename: 'detailInfo.html',
      chunks: ['detailInfo'],
    }),
    new HtmlWebpackPlugin({
      template: paths.src + '/prodTemplate/price.html',
      templateParameters: {
        path: '/web/admin/',
      },
      filename: 'price.html',
      chunks: ['price'],
    }),
    new HtmlWebpackPlugin({
      template: paths.src + '/prodTemplate/setting.html',
      templateParameters: {
        path: '/web/admin/',
      },
      filename: 'setting.html',
      chunks: ['setting'],
    }),
    new HtmlWebpackPlugin({
      template: paths.src + '/prodTemplate/level.html',
      templateParameters: {
        path: '/web/admin/',
      },
      filename: 'level.html',
      chunks: ['level'],
    }),
  ],
  output: {
    path: paths.output.prod,
    filename: 'js/[name]_bundle.[contenthash].js',
    publicPath: '/web/admin/',
    assetModuleFilename: 'assets/[hash][ext][query]',
  },
  optimization: {
    minimize: true,
  },
});
