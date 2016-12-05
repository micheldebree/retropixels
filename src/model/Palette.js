var Pixels = require('./Pixels.js');

function Palette(pixels) {
    'use strict';
    this.pixels = pixels === undefined ? [] : pixels;

    this.get = function(index) {
        return this.pixels[index];
    };

    /**
     * Map a pixel to the closest available color in the palette.
     * @returns the index into the palette
     */
    this.mapPixel = function(pixel, offset, weight) {
        var i,
            d,
            minVal,
            minI;

        // determine closest pixel in palette (ignoring alpha)
        for (i = 0; i < this.pixels.length; i += 1) {
            d = Pixels.getDistance(pixel, this.pixels[i], offset, weight);
            if (minVal === undefined || d < minVal) {
                minVal = d;
                minI = i;
            }
        }
        return minI;
    };

}

module.exports = Palette;
