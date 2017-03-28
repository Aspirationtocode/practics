const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const dist = __dirname + '/dist';

module.exports = {
	context: __dirname + '/src',
	entry: './scripts/index.js',
	output: {
		path: dist,
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.styl$/,
				exclude: /node_modules/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'stylus-loader']
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
				test: /\.(jpg)$/,
				use: "file-loader?name=[name].[ext]&outputPath=images/&publicPath=images/"
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				loader: 'file-loader?name=[name].[ext]&outputPath=fonts/&publicPath=fonts/'
			}
		]
	},
	devServer: {
		contentBase: __dirname + '/dist',
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
			filename: 'bundle.css',
			disable: false,
			allChunks: true
		})
	]
}
