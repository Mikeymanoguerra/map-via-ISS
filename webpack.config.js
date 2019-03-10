const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
  context: __dirname,
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: '/Views-via-ISS',
    filename: 'main.js'
  },
  // optimization: {
  //   minimizer: [
  //     new UglifyJsPlugin({
  //       cache: true,
  //       parallel: true,
  //       sourceMap: true // set to true if you want JS source maps
  //     }),
  //     new OptimizeCSSAssetsPlugin({})
  //   ]
  // },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      // { test: /\.png$/, loader: 'file-loader' },
      { test: /\.html$/, loader: 'html-loader' }
    ]
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      // favicon: 'favicon.ico',
      template: './index.html'
    }),
    new MiniCssExtractPlugin({ filename: 'index.css' })
  ]
};