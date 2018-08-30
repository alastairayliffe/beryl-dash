const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const PORT = 3000
const config = require('./backend/configs/backend');
const webpackProd = require('./webpackProd')
const webpackDev = require('./webpackDev')

module.exports = config.PORT === '3000' ? webpackDev : webpackProd