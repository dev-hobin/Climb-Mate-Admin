const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const paths = require('./paths');

module.exports = merge(common, {
  mode: 'development',
  target: 'web',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: paths.build,
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
});
