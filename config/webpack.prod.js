/* eslint-disable global-require */
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const CompressionPlugin = require('compression-webpack-plugin');
// const BrotliPlugin = require('brotli-webpack-plugin');

const commonPlugins = [
  new webpack.DefinePlugin(require('./env')()),
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: '[name].[chunkhash:8].bundle.css',
    chunkFilename: '[name].[chunkhash:8].chunk.css',
  }),
  new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: 'index.html',
  }),
  /*
  new BundleAnalyzerPlugin(),
  new CompressionPlugin({
    algorithm: 'gzip',
  }),
  new BrotliPlugin({})
  */
];

const commonConfig = {
  mode: 'production',

  module: {
    rules: require('./module.rules'),
  },
};

const optimization = {
  minimizer: [
    new TerserJSPlugin({
      parallel: 4,
      terserOptions: {
        compress: true,
        output: {
          comments: false,
          beautify: false,
        },
      },
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
    }),
  ],
  splitChunks: {
    cacheGroups: {
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
      },
    },
    chunks: 'all',
  },
  runtimeChunk: {
    name: 'runtime',
  },
};

module.exports = {
  ...commonConfig,

  plugins: commonPlugins,

  optimization,

  output: {
    path: path.resolve(__dirname, '../build'),
    filename: '[name].[chunkhash:8].bundle.js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
  },

  entry: {
    main: ['./src/index.js'],
  },
};
