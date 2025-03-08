const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const outputPath = path.join(__dirname, 'dist');

const mainConfig = {
  name: 'main',
  target: 'electron-main',
  mode: 'development',
  entry: './src/main/index.ts',
  output: {
    path: outputPath,
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript']
          }
        }
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  devtool: 'inline-source-map'
}

const rendererConfig = {
  name: 'renderer',
  target: 'electron-renderer',
  mode: 'development',
  entry: './src/renderer/index.tsx',
  output: {
    path: outputPath,
    filename: 'renderer.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
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
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src/renderer')
    }
  },
  devtool: 'inline-source-map',
}

const preloadConfig = {
  name: 'preload',
  target: 'electron-preload',
  mode: 'development',
  entry: './src/preload/index.ts',
  output: {
    path: outputPath,
    filename: 'preload.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  devtool: 'inline-source-map'
}

module.exports = [
  mainConfig, rendererConfig, preloadConfig
]