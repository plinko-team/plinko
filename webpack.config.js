var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

module.exports = {
  target: 'web',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: "babel-loader",
        options: {
          presets: ["es2015"]
        },
      }
    ]
  },
}
