var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

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
    plugins: [
        new WebpackCleanupPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                drop_console: true,
                drop_debugger: true
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.ContextReplacementPlugin('[name]'),
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
