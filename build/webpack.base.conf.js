const webpack = require('webpack');
const pkg = require('../package.json');
const { resolve, isProd } = require('./utils');

const baseConfig = {
  target: 'web',
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : 'source-map',
  entry: {
    index: [resolve('src/index.js')],
  },
  output: {
    filename: '[name].js',
    path: resolve('dist'),
    library: pkg.name,
    libraryTarget: 'umd',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': resolve('src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        include: [resolve('src'), resolve('demo')],
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true, // 开启babel编译缓存
              cacheCompression: false, // 缓存文件不要压缩
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        BUILD_ENV: JSON.stringify(process.env.BUILD_ENV),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
};

module.exports = baseConfig;
