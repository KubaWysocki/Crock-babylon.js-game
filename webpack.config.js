/* eslint-disable */
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								[ '@babel/preset-env', {
									'targets': {
										'node': 'current'
									}
								} ]
							]
						}
					},
					{ loader: 'eslint-loader' }
				] 
			},
			{
				test: /\.css$/,
				use: [ 
					MiniCssExtractPlugin.loader,
					'css-loader'
				]
			},
			{
				test: /\.(png|jpe?g|gif|wav)$/,
				use: { loader: 'file-loader' },
			},
			{
				test: /\.(gltf)$/,
				use: [ { loader: 'gltf-webpack-loader' } ]
			}
		],
	},
	plugins: [
		new HtmlWebpackPlugin({ template: './src/index.html' }),
		new MiniCssExtractPlugin()
	],
	devServer: { port: 3000 }
}