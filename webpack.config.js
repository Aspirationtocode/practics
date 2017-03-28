const path = require('path');
const webpack = require('webpack');
const CssSourcemapPlugin = require('css-sourcemaps-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const dist = path.join(__dirname, 'dist');
const src = path.join(__dirname, 'src');

const isProd = process.env.NODE_ENV === 'production';
const devCss = ['style-loader', 'css-loader', 'stylus-loader'];
const prodCss = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: ['css-loader', 'stylus-loader']
})
const configCss = isProd ? prodCss : devCss;
const sourcemap = isProd ? false : "source-map";

module.exports = {
	context: src,
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
				use: configCss
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
				test: /\.(jpg|png|svg)$/,
				use: "file-loader?name=[name].[ext]&outputPath=images/&publicPath=images/"
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				loader: 'file-loader?name=[name].[ext]&outputPath=fonts/&publicPath=fonts/'
			}
		]
	},
	devtool: sourcemap,
	devServer: {
		contentBase: dist,
		compress: true,
		hot: true,
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
			disable: isProd,
			allChunks: true
		}),
		new CssSourcemapPlugin({disable: isProd}),
		new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
	]
}
