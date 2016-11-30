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
