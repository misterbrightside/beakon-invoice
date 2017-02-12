const path = require('path');
const webpack = require('webpack');
// const autoprefixer = require('autoprefixer');
const isProduction = process.env.NODE_ENV === 'production';

const buildPath = path.resolve(__dirname, 'build');
const frontendEntryPath = path.resolve(__dirname, 'app', 'index.js');
const adminEntryPath = path.resolve(__dirname, 'admin', 'index.js');

const entries = {
  frontendBundle: frontendEntryPath,
  adminBundle: adminEntryPath,
};

const pluginsUsed = [
  new webpack.optimize.UglifyJsPlugin(),
];

pluginsUsed.push(
  new webpack.DefinePlugin({
    IS_PRODUCTION: JSON.stringify(isProduction),
    IS_DEVELOPMENT: JSON.stringify(!isProduction),
  }));

const cssIdentifer = '[path][name]---[local]';

const cssLoader = ['style-loader', 'css-loader?localIdentName=' + cssIdentifer];

const config = {
  devtool: 'eval-source-map',
  entry: entries,
  plugins: pluginsUsed,
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      exclude: '/node_modules/',
    }, {
      test: /\.(png|gif|jpg)$/,
      loaders: ['url-loader?limit=10000&name=images/[hash:12].[ext]'],
      exclude: '/node_modules/',
    }, {
      test: /\.css$/,
      loaders: cssLoader,
      exclude: '/node_modules/',
    }, {
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff',
    }, {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff',
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/octet-stream',
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader',
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
    }],
  },
  output: {
    path: buildPath,
    publicPath: isProduction ? '/' : '/wp-content/plugins/beakon-invoice/js/build/',
    filename: '[name].js',
  },
};

module.exports = config;
