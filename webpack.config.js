const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const dist = path.resolve('dist');
const source = path.resolve('src/scripts/index.js');

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
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.pug$/,
        use: ["pug-loader"]
      },
      {
        test: /\.(svg|png|jpg|ttf)$/,
        loader: 'url-loader'
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
      template: path.resolve('src/views/index.pug'),
      hash: true
    }),
    new ExtractTextPlugin({
      filename: 'app.css',
      disable: false,
      allChunks: true
    })
  ]
}
