const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const outputPath = path.join(__dirname, 'dist');

const mainConfig = {
  name: 'main',
  target: 'electron-main',
  mode: 'development',
  entry: './src/main/index.js',
  output: {
    path: outputPath,
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'eval'
}

const rendererConfig = {
  name: 'renderer',
  target: 'electron-renderer',
  mode: 'development',
  entry: './js/script.js',
  output: {
    path: outputPath,
    filename: 'renderer.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: './css/main.css', to: './css' },
      ],
    }),
  ],
  devtool: 'eval'
}

const preloadConfig = {
  name: 'preload',
  target: 'electron-preload',
  mode: 'development',
  entry: './js/preload.js',
  output: {
    path: outputPath,
    filename: 'preload.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'eval'
}

module.exports = [
  mainConfig, rendererConfig, preloadConfig
]