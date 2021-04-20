const path = require('path');

module.exports = {
  // 소스 파일 경로
  src: path.resolve(__dirname, '../src'),

  // 빌드 파일 경로
  build: path.resolve(__dirname, '../dist'),

  // 정적 파일 경로
  static: path.resolve(__dirname, '../static'),
};
