const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const dist = path.resolve('dist');
const source = path.resolve('src/app.js');

module.exports = {
  entry: source,
  output: {
    path: dist,
    filename: 'app.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.styl$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'stylus-loader'],
          publicPath: dist
        })
      }
    ]
  },
  devServer: {
    contentBase: dist,
    compress: true,
    port: 3000,
    stats: 'errors-only',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Project',
      template: path.resolve('src/index.ejs'),
      hash: true
    }),
    new ExtractTextPlugin({
      filename: 'app.css',
      disable: false,
      allChunks: true
    })
  ]
}
