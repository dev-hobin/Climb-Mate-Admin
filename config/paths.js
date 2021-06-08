const path = require('path');

module.exports = {
  src: path.resolve(__dirname, '../src'),
  static: path.resolve(__dirname, '../static'),
  output: {
    test: path.resolve(__dirname, '../test'),
    prod: path.resolve(__dirname, '../prod'),
    dev: path.resolve(__dirname, '../dist'),
  },
};
