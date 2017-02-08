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
    }]
  },
  output: {
    path: buildPath,
    publicPath: isProduction ? '/' : '/build/',
    filename: 'bundle.js'
  }
}

module.exports = config
