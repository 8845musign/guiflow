const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

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
      },
    ]
  },
  devtool: 'inline-source-map'
}

const rendererConfig = {
  name: 'renderer',
  target: 'electron-renderer',
  mode: 'development',
  entry: './src/renderer/index.js',
  output: {
    path: outputPath,
    filename: 'renderer.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: './src/css/main.css', to: './css' },
      ],
    }),
    new VueLoaderPlugin()
  ],
  devtool: 'inline-source-map',
}

const preloadConfig = {
  name: 'preload',
  target: 'electron-preload',
  mode: 'development',
  entry: './src/preload/index.js',
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
  devtool: 'inline-source-map'
}

module.exports = [
  mainConfig, rendererConfig, preloadConfig
]