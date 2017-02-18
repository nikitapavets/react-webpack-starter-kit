"use strict";
var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || "3000";

loaders.push({
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract('css?sourceMap&localIdentName=[local]___[hash:base64:5]!sass?outputStyle=expanded'),
    exclude: ['node_modules']
});

module.exports = {
    entry: {
        admin: [
            'react-hot-loader/patch',
            './src/admin/index.jsx',
            './src/admin/styles/index.scss'
        ],
        client: [
            'react-hot-loader/patch',
            './src/client/index.jsx',
            './src/client/styles/index.scss'
        ]
    },
    devtool: process.env.WEBPACK_DEVTOOL || 'eval-source-map',
    output: {
        publicPath: '/',
        path: path.join(__dirname, 'public'),
        filename: './[name]/index.js',
        library: '[name]'
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.scss']
    },
    module: {
        loaders
    },
    devServer: {
        contentBase: "./public",
        noInfo: true,
        hot: true,
        inline: true,
        historyApiFallback: true,
        port: PORT,
        host: HOST
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new DashboardPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'core',
            chunks: ['admin', 'client']
        }),
        new ExtractTextPlugin("[name]/index.css", {
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            template: './src/admin/index.html',
            filename: './admin/index.html',
            hash: true,
            chunks: ['core', 'admin']
        }),
        new HtmlWebpackPlugin({
            template: './src/client/index.html',
            filename: './client/index.html',
            hash: true,
            chunks: ['core', 'client']
        }),
    ]
};
