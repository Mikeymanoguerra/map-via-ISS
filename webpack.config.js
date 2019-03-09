const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackMajorVersion = require('webpack/package.json').version.split('.')[0];

module.exports = {
  context: __dirname,
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: '',
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: ''
            }
          },
          'css-loader'
        ]
      },
      // { test: /\.png$/, loader: 'file-loader' },
      // { test: /\.html$/, loader: 'html-loader' }
    ]
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      // favicon: 'favicon.ico',
      template: 'index.html'
    }),
    new MiniCssExtractPlugin({ filename: 'index.css' })
  ]
};