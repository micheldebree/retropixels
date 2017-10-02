/**
 * Pack the Converter into a bundle to be used in the browser.
 */
var webpack = require('webpack');

module.exports = {
    entry: './target/conversion/Converter.js',
    output: {
        path: './target',
        filename: 'Converter.bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    },
    plugins: [
         new webpack.optimize.UglifyJsPlugin({minimize: true})
    ],
};
