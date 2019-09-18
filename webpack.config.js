const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

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
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|wav)$/,
        use: { loader: 'file-loader' },
      },
      {
        test: /\.(gltf)$/,
        use: [{ loader: "gltf-webpack-loader" }]
      }
    ],
  },
  plugins: [
      new HtmlWebpackPlugin({ template: './src/index.html' }),
  ],
  devServer: { port: 3000 }
}