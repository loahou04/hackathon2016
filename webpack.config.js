var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	entry: "./src/public/chat.js",
	output: {
		path: __dirname + "/src/public/",
		publicPath: "./",
		filename: "chat.min.js",
		libraryTarget: "umd",
		library: "CourseCopyUI"
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel',
				query: {
					presets: ['es2015', 'react', 'stage-0']
				}
			},
			{
				// sass-loader for the origami pieces
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract("style", "css!sass")
			}
		]
	},
	plugins: [
		// uncomment to minify
		// new webpack.optimize.UglifyJsPlugin({minimize: true}),

		// css bundles....
		new ExtractTextPlugin("coursecopyui.css", {}),
		new webpack.ProvidePlugin({
            'Promise': 'es6-promise', // Thanks Aaron (https://gist.github.com/Couto/b29676dd1ab8714a818f#gistcomment-1584602)
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
	],

	//resolve bower_components
	resolve: {
		modulesDirectories: ["node_modules"],
		extensions: ["", ".js", ".jsx"]
	}
};