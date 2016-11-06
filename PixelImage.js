/*exported PixelImage*/
/*jslint bitwise: true*/
/** Create an image with access to individual pixels

    A pixel's color at (x,y) is determined through 2 indirections:

    - colormapIndex = pixelIndex[x,y]
    - paletteIndex = colorMaps[colormapIndex][x,y]
    - color = palette[paletteIndex]
    - red = color[0], green = color[1], blue = color[2]

    Pixels are indexed:
    - index at (x,y) undefined -> transparant
    - index at (x,y) = number -> number of colormap in which color is stored at (x,y)

    Colormaps contain a mapping from (x,y) to an index in the palette.

http://csdb.dk/forums/?roomid=11&topicid=21409&showallposts=1

http://www.tannerhelland.com/4660/dithering-eleven-algorithms-source-code/

http://www.efg2.com/Lab/Library/ImageProcessing/DHALF.TXT

*/

var ColorMap = require('./ColorMap.js');
var PixelCalculator = require('./PixelCalculator.js');

function PixelImage(width, height, pWidth, pHeight) {
    'use strict';
    // public properties
    this.width = width;
    this.height = height;
    this.pWidth = pWidth === undefined ? 1 : pWidth; // aspect width of one pixel
    this.pHeight = pHeight === undefined ? 1 : pHeight; // aspect height of one pixel
    this.colorMaps = []; // maps x,y to a color
    this.palette = undefined; // the palette for all colors used in this image
    var pixelIndex = []; // maps pixel x,y to a colormap
    this.ditherOffset = []; // offset for dithering used when mapping color
    this.dither = [
        [0]
    ]; // n x n bayer matrix for ordered dithering
    this.errorDiffusionDither = function() {};

    // weight per pixel channel (RGB or YUV) when calculating distance
    // [1, 1, 1] is equal weight, [1, 0, 0] in combination with YUV is phychedelic mode
    this.mappingWeight = [1, 1, 1];

    var that = this;

    var findColorInMap = function(x, y, color) {
        for (var i = 0; i < that.colorMaps.length; i += 1) {
            if (color === that.colorMaps[i].getColor(x, y)) {
                return i;
            }
        }
        return undefined;
    };

    /**
     * Map a pixel to the closest available Colormap.
     * @param {int} x X coordinate
     * @param {int} y Y coordinate
     * @returns {int} Colormap index for the closest Colormap
     */
    var map = function(pixel, x, y, offsetPixel) {

        var i,
            d,
            minVal,
            minI = 0,
            other;

        // determine closest pixel in palette (ignoring alpha)
        for (i = 0; i < that.colorMaps.length; i += 1) {
            other = that.colorMaps[i].getColor(x, y);
            d = that.palette.getDistance(pixel, other, offsetPixel, that.mappingWeight);
            if (minVal === undefined || d < minVal) {
                minVal = d;
                minI = i;
            }
        }

        return minI;

    };

    var setPixelIndex = function s(x, y, index) {
        if (pixelIndex[y] === undefined) {
            pixelIndex[y] = [];
        }
        pixelIndex[y][x] = index;
    };

    this.getPixelIndex = function(x, y) {
        var row = pixelIndex[y];
        return row !== undefined ? row[x] : undefined;
    };

    var getPaletteIndex = function(x, y) {
        var ci = that.getPixelIndex(x, y);
        return ci !== undefined ? that.colorMaps[ci].getColor(x, y) : undefined;
    };

    /**
     * Set the value for a particular pixel.
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @param {Array} pixel - Pixel values [r, g, b, a]
     */
    this.poke = function(x, y, pixel) {

        var mappedIndex,
            mappedPixel,
            colorMap,
            offsetPixel,
            error;

        offsetPixel = this.getDitherOffset(x, y);

        // map to closest color in palette
        mappedIndex = this.palette.mapPixel(pixel, offsetPixel, this.mappingWeight);


        // use the error for dithering
        mappedPixel = this.palette.get(mappedIndex);
        error = PixelCalculator.substract(mappedPixel, pixel);
        this.orderedDither(x, y, pixel);
        this.errorDiffusionDither(this, x, y, error);

        // try to reuse existing color map
        colorMap = findColorInMap(x, y, mappedIndex);

        // else see if there is there is a map with an empty pixel
        if (colorMap === undefined) {
            colorMap = findColorInMap(x, y, undefined);
        }

        if (colorMap !== undefined) {
            this.colorMaps[colorMap].add(x, y, mappedIndex);
        } else {
            // if all else fails, map to closest existing color
            if (colorMap === undefined) {
                colorMap = map(pixel, x, y, offsetPixel);
            }
        }

        setPixelIndex(x, y, colorMap);

    };

    /**
     * Get the value of a particular pixel.
     * @param {int} x X coordinate
     * @param {int} y Y coordinate
     * @returns {Array} Pixel values [r, g, b, a], or an empty pixel if x and y are out of range.
     */
    this.peek = function(x, y) {
        var paletteIndex = getPaletteIndex(x, y);
        return paletteIndex !== undefined ? this.palette.get(paletteIndex) : PixelImage.emptyPixel;
    };

}

PixelImage.prototype.setDitherOffset = function(x, y, offsetPixel) {
    'use strict';
    if (x < this.width && y < this.height) {
        if (this.ditherOffset[y] === undefined) {
            this.ditherOffset[y] = [];
        }
        this.ditherOffset[y][x] = offsetPixel;
    }
};

PixelImage.prototype.addDitherOffset = function(x, y, offsetPixel) {
    'use strict';
    var currentOffset = this.getDitherOffset(x, y);
    this.setDitherOffset(x, y, PixelCalculator.add(currentOffset, offsetPixel));
};

PixelImage.prototype.getDitherOffset = function(x, y) {
    'use strict';
    var row = this.ditherOffset[y];
    if (row !== undefined && row[x] !== undefined) {
        return row[x];
    }
    return PixelCalculator.emptyPixel;
};

PixelImage.prototype.orderedDither = function(x, y) {
    'use strict';
    var offset = this.dither[y % this.dither.length][x % this.dither.length];
    this.addDitherOffset(x + 1, y, [offset, offset, offset]);
};

PixelImage.prototype.drawImageData = function(imageData) {
    'use strict';
    var x,
        y,
        pixel;

    for (y = 0; y < this.height; y += 1) {
        for (x = 0; x < this.width; x += 1) {
            pixel = PixelCalculator.peek(imageData, x, y);
            this.poke(x, y, pixel);
        }
    }
};

PixelImage.prototype.fromImageData = function(imageData) {
    'use strict';
    this.init(imageData.width, imageData.height);
    this.colorMaps = [new ColorMap(this.width, this.height, 1, 1)];
    this.drawImageData(imageData);
};

PixelImage.prototype.addColorMap = function(colorMap) {
    'use strict';
    this.colorMaps.push(colorMap);
};

module.exports = PixelImage;
