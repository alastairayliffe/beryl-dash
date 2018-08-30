const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./backend/configs/backend');

const webpackDev = {
        entry: './client/index.js',
        output: {
          filename: 'bundle.js',
          path: path.resolve(__dirname, 'build/dist'),
          publicPath: `${process.env.PUBLIC_PATH}/build/dist/`
        },
        plugins: [
          new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
          }),
        ],
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /(node_modules)/,
              loader: require.resolve('babel-loader')
            },
            {
              test: /.*\.(gif|png|jpe?g)$/,  
              use: [{
                  loader: 'url-loader',
                  options: { 
                      limit: 4000, // Convert images < 8kb to base64 strings
                      name: 'assets/[hash]-[name].[ext]'
                  } 
              }]
            },
            {
              test: /.*\.(gif|png|jpe?g)$/i,
              use: [
                {
                  loader: 'image-webpack-loader',
                  options: {
                    webp: {
                      quality: 75
                    }
                  },
                }
              ]
            },
            {
              test: /\.scss$/,
              use: [
                'style-loader',
                'css-loader',
                'sass-loader',
              ],
            },
          ]
        }
      }

module.exports = webpackDev;