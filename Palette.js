var PixelCalculator = require('./PixelCalculator.js');

function Palette(pixels) {
    'use strict';
    this.pixels = pixels === undefined ? [] : pixels;
}

Palette.prototype.get = function (index) {
    'use strict';
    return this.pixels[index];
};


Palette.prototype.getDistance = function (onePixel, index, offsetPixel, weight) {
    'use strict';
    var otherPixel = this.pixels[index];
    
    offsetPixel = offsetPixel !== undefined ? offsetPixel : PixelCalculator.emptyPixel;
    weight = weight !== undefined ? weight : [1, 1, 1];

    onePixel = PixelCalculator.toYUV(onePixel);
    otherPixel = PixelCalculator.toYUV(otherPixel);
    offsetPixel = PixelCalculator.toYUV(offsetPixel);

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
Palette.prototype.mapPixel = function (pixel, offset, weight) {
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

// TODO: put this somewhere but not in a global variable
Palette.peptoPalette = new Palette([
    [0, 0, 0, 0xff], // black
    [0xff, 0xff, 0xff, 0xff], // white
    [0x68, 0x37, 0x2b, 0xff], //red
    [0x70, 0xa4, 0xb2, 0xff], //cyan
    [0x6f, 0x3d, 0x86, 0xff], //purple
    [0x58, 0x8d, 0x43, 0xff], //green
    [0x35, 0x28, 0x79, 0xff], //blue
    [0xb8, 0xc7, 0x6f, 0xff], //yellow
    [0x6f, 0x4f, 0x25, 0xff], //orange
    [0x43, 0x39, 0x00, 0xff], //brown
    [0x9a, 0x67, 0x59, 0xff], //light red
    [0x44, 0x44, 0x44, 0xff], //dark gray
    [0x6c, 0x6c, 0x6c, 0xff], //medium gray
    [0x9a, 0xd2, 0x84, 0xff], //light green
    [0x6c, 0x5e, 0xb5, 0xff], //light blue
    [0x95, 0x95, 0x95, 0xff]  //green
]);

module.exports = Palette;
