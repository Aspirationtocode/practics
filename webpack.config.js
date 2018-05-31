const path = require('path');
const webpack = require('webpack');
const CssSourcemapPlugin = require('css-sourcemaps-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const browsers = require('./package').browsers;

const autoprefixerBrowsers = [
	'Android >= ' + browsers.android,
	'Chrome >= ' + browsers.chrome,
	'Firefox >= ' + browsers.firefox,
	'Explorer >= ' + browsers.ie,
	'iOS >= ' + browsers.ios,
	'Opera >= ' + browsers.opera,
	'Safari >= ' + browsers.safari
].map(browser => `"${browser}"`);

const autoprefixerLoader = `autoprefixer-loader?{browsers:[${autoprefixerBrowsers}]}`;

const imageOptimizeConfig = [
  'file-loader?name=[name].[ext]&outputPath=images/',
  {
    loader: 'image-webpack-loader',
    query: {
      mozjpeg: {
        quality: 65,
      },
      pngquant: {
        quality: '60-90',
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            removeViewBox: false,
          },
          {
            removeEmptyAttrs: false,
          },
        ],
      },
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
        interlaced: false,
      },
    },
  },
];

const cssLoaders = ['style-loader', 'css-loader', autoprefixerLoader, 'stylus-loader'];

const dist = path.join(__dirname, 'dist');
const src = path.join(__dirname, 'src');

const isProd = process.env.NODE_ENV === 'production';

const devCss = cssLoaders;
const prodCss = ExtractTextPlugin.extract({
	fallback: 'style-loader',
	use: cssLoaders.slice(1)
})

const configCss = isProd ? prodCss : devCss;
const sourcemap = isProd ? false : "source-map";

const docs = require("./docs");

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
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
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
				use: isProd ? imageOptimizeConfig : imageOptimizeConfig.slice(0, 1),
			},
			{
        test: /\.(pdf|doc|docx|xps|exe)$/,
        use: 'file-loader?name=[name].[ext]&outputPath=docs/',
      },
			{
				test: /\.(eot|ttf|woff|woff2)$/,
				use: 'file-loader?name=[name].[ext]&outputPath=fonts/'
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
			hash: true,
			options: docs,
			filename: 'index.html'
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
