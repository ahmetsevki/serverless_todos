// webpack.config.js
var nodeExternals = require('webpack-node-externals');
module.exports = {
  entry: './handler.js',
  target: 'node',
  externals: [nodeExternals()], // exclude external modules
  module: {
   	preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'jshint-loader'

      }
   	]
  }
};
