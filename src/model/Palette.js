var Pixels = require('./Pixels.js');

function Palette(pixels) {
    'use strict';
    this.pixels = pixels === undefined ? [] : pixels;
}

Palette.prototype.get = function(index) {
    'use strict';
    return this.pixels[index];
};

Palette.prototype.getDistance = function(onePixel, index, offsetPixel, weight) {
    'use strict';
    var otherPixel = this.pixels[index];

    offsetPixel = offsetPixel !== undefined ? offsetPixel : Pixels.emptyPixel;
    weight = weight !== undefined ? weight : [1, 1, 1];

    onePixel = Pixels.toYUV(onePixel);
    otherPixel = Pixels.toYUV(otherPixel);
    offsetPixel = Pixels.toYUV(offsetPixel);

    return Math.sqrt(
        weight[0] * Math.pow(onePixel[0] - otherPixel[0] - offsetPixel[0], 2) +
        weight[1] * Math.pow(onePixel[1] - otherPixel[1] - offsetPixel[1], 2) +
        weight[2] * Math.pow(onePixel[2] - otherPixel[2] - offsetPixel[2], 2)
    );
};

/**
 * Map a pixel to the closest available color in the palette.
 * @returns the index into the palette
 */
Palette.prototype.mapPixel = function(pixel, offset, weight) {
    'use strict';
    var i,
        d,
        minVal,
        minI;

    // determine closest pixel in palette (ignoring alpha)
    for (i = 0; i < this.pixels.length; i += 1) {
        // calculate distance
        d = this.getDistance(pixel, i, offset, weight);

        if (minVal === undefined || d < minVal) {
            minVal = d;
            minI = i;
        }
    }
    return minI;
};

module.exports = Palette;
