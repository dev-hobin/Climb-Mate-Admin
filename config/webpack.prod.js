const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const paths = require('./paths');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
  mode: 'production',
  target: 'browserslist',
  devtool: false,
  module: {
    rules: [
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/',
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
  ],
  output: {
    path: paths.build,
    filename: 'js/[name]_bundle.[contenthash].js',
  },
  optimization: {
    minimize: true,
  },
});
