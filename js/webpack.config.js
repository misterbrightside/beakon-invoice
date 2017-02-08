var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var isProduction = process.env.NODE_ENV === 'production'

var buildPath = path.resolve(__dirname, 'build')
var jsEntryPath = path.resolve(__dirname, 'app', 'index.js')

var entry = isProduction ? [ jsEntryPath ] : [
  jsEntryPath
]

var plugins = [
  new webpack.optimize.UglifyJsPlugin()
]

plugins.push(
  new webpack.DefinePlugin({
    IS_PRODUCTION: JSON.stringify(isProduction),
    IS_DEVELOPMENT: JSON.stringify(!isProduction)
  })
)

const cssIdentifer = '[path][name]---[local]'

const cssLoader = ['style-loader', 'css-loader?localIdentName=' + cssIdentifer]

var config = {
  devtool: 'eval',
  entry: entry,
  plugins: plugins,
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      exclude: '/node_modules/'
    }, {
      test: /\.(png|gif|jpg)$/,
      loaders: ['url-loader?limit=10000&name=images/[hash:12].[ext]'],
      exclude: '/node_modules/'
    }, {
      test: /\.css$/,
      loaders: cssLoader,
      exclude: '/node_modules/'
    }, {
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff'
    }, {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff'
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader'
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
    }]
  },
  output: {
    path: buildPath,
    publicPath: isProduction ? '/' : '/wp-content/plugins/beakon-invoice/js/build/',
    filename: 'bundle.js'
  }
}

module.exports = config
