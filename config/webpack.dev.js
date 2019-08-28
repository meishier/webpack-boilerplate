/* eslint-disable global-require */
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const commonPlugins = [
  new webpack.DefinePlugin(require('./env')()),
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: 'index.html',
  }),
  new StyleLintPlugin(),
];

const commonConfig = {
  mode: 'development',

  devServer: {
    contentBase: path.join(__dirname, '../build'),
    compress: true,
    port: Number(process.env.DEV_SERVER_PORT),
    overlay: true,
  },

  module: {
    rules: require('./module.rules'),
  },

  devtool: 'cheap-module-eval-source-map',
};

module.exports = {
  ...commonConfig,

  plugins: commonPlugins,

  output: {
    path: path.resolve(__dirname, '../build'),
    filename: '[name].bundle.js',
  },

  entry: {
    main: ['./src/index.js'],
  },
};
