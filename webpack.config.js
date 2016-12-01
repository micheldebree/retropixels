/**
 * Pack the Converter into a bundle to be used in the browser.
 */
var webpack = require("webpack");

module.exports = {
     entry: './src/conversion/Converter.js',
     output: {
         path: './target',
         filename: 'Converter.bundle.js'
     },
     plugins: [
       new webpack.optimize.UglifyJsPlugin({minimize: true})
     ]
};
