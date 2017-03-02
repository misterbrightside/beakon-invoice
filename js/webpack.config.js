const path = require('path');
const webpack = require('webpack');
// const autoprefixer = require('autoprefixer');
const isProduction = process.env.NODE_ENV === 'production';
const ipAddress = process.env.IP_ADDRESS && !isProduction ? process.env.IP_ADDRESS : '';
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const buildPath = path.resolve(__dirname, 'build');
const frontendEntryPath = path.resolve(__dirname, 'app', 'index.js');
const adminEntryPath = path.resolve(__dirname, 'admin', 'index.js');
const bulkImportEntryPath = path.resolve(__dirname, 'admin/BulkImport', 'index.js');
const settingsPageEntryPath = path.resolve(__dirname, 'admin/SettingsPage', 'index.js');

const entries = {
  frontendBundle: frontendEntryPath,
  adminBundle: adminEntryPath,
  bulkImportBundle: bulkImportEntryPath,
  settingsPageBundle: settingsPageEntryPath,
};

const pluginsUsed = [
  // new webpack.optimize.UglifyJsPlugin(),
  // new ExtractTextPlugin("[name]-styles.css"),
];

pluginsUsed.push(
  new webpack.DefinePlugin({
    IS_PRODUCTION: JSON.stringify(isProduction),
    IS_DEVELOPMENT: JSON.stringify(!isProduction),
    IP_ADDRESS: JSON.stringify(ipAddress),
  }));

const cssIdentifer = '[path][name]---[local]';

// const cssLoader = ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?localIdentName=' + cssIdentifer });
const cssLoader = [ 'style-loader', 'css-loader?localIdentName=' + cssIdentifer ];

const config = {
  devtool: '#source-maps',
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
