const path = require('path');

module.exports = {
	entry: {
		source: path.resolve(__dirname, 'app', 'app')
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'bundles')
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		rules: [
			{
				test: /\.js/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-react',
							'@babel/preset-env'
						],
						plugins: [
				      "@babel/plugin-proposal-class-properties"
				    ]
					}
				}
			}
		]
	},
	mode: 'development'
}
