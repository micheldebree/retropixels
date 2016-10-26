/*global PixelCalculator, document */
/*exported ColorMap*/
/**
 * Maps x, y coordinates to a pixel value.
 * The map has a certain resolution specifying the size of an area of the same color.
 * @param {PixelImage} pixelImage - Image to extract the color map from.
 * @param {number} width - Width of the map in pixels
 * @param {number} height - Height of the map in pixels
 * @param {number} [resX] - Number of horizontal pixels in color areas.
 * @param {number} [resY] - Number of vertical pixels in color areas.
 *
 * A color is an index into a palette. A pixel is a set of RGBA values.
 */

// http://stackoverflow.com/questions/8580540/javascript-calling-private-method-from-prototype-method

function ColorMap(widthVal, heightVal, resXVal, resYVal) {
    'use strict';
    this.colors = [];
    this.width = widthVal;
    this.height = heightVal;
    this.resX = resXVal !== undefined ? resXVal : widthVal;
    this.resY = resYVal !== undefined ? resYVal : heightVal;
}

/**
 * Is a coordinate in range?
 */
ColorMap.prototype.isInRange = function(x, y) {
    'use strict';
    return (x >= 0 && x < this.width && y >= 0 && y < this.height);
};

/**
 * Map an image x coordinate to a map x coordinate.
 */
ColorMap.prototype.mapX = function(x) {
    'use strict';
    return Math.floor(x / this.resX);
};

/**
 * Map an image y coordinate to a map y coordinate.
 */
ColorMap.prototype.mapY = function mapY(y) {
    'use strict';
    return Math.floor(y / this.resY);
};

/**
 * Set an area to a certain color.
 */
ColorMap.prototype.add = function(x, y, color) {
    'use strict';
    if (!this.isInRange(x, y)) {
        return;
    }

    var rx = this.mapX(x);

    // add it to the color map
    if (this.colors[rx] === undefined) {
        this.colors[rx] = [];
    }
    this.colors[rx][this.mapY(y)] = color;

};

/**
 * Convert to an image so it can be displayed.
 * @param {Palette} the palette to use for looking up the colors.
 */
ColorMap.prototype.toImageData = function toImageData(palette) {
    'use strict';
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        imageData = context.createImageData(this.width, this.height),
        x,
        y;

    for (y = 0; y < this.height; y += 1) {
        for (x = 0; x < this.width; x += 1) {
            PixelCalculator.poke(imageData, x, y, palette.get(this.getColor(x, y)));
        }
    }

    return imageData;
};

/**
 * Get the palette index at x, y coordinate.
 */
ColorMap.prototype.getColor = function(x, y) {
    'use strict';
    var mX = this.mapX(x),
        mY = this.mapY(y);

    if (this.colors[mX] !== undefined) {
        return this.colors[mX][mY];
    }
    return undefined;
};

ColorMap.prototype.clear = function() {
'use strict';
    var x,y;
 for (y = 0; y < this.height; y += 1) {
        for (x = 0; x < this.width; x += 1) {
            this.add(x,y, undefined);
        }
    }

    this.colors = [];
};

/**
  Get the color that is most present in an area of the colormap.
**/
ColorMap.prototype.reduceToMax = function(x, y, w, h) {
    'use strict';
    var weights = [],
        ix,
        iy,
        color,
        maxWeight,
        maxColor;

    for (ix = x; ix < x + w; ix += 1) {
        for (iy = y; iy < y + h; iy += 1) {
            color = this.getColor(ix, iy);
            if (color !== undefined) {
                weights[color] = weights[color] === undefined ? 1 : weights[color] + 1;
                if (maxWeight === undefined || weights[color] > maxWeight) {
                    maxWeight = weights[color];
                    maxColor = color;
                }
            }
        }
    }

    return maxColor;

};

ColorMap.prototype.subtract = function(colorMap) {
    'use strict';
    var x,
        y;

    for (x = 0; x < this.width; x += this.resX) {
        for (y = 0; y < this.height; y += this.resY) {
            if (this.getColor(x, y) === colorMap.getColor(x, y)) {
                this.add(x, y, undefined);
            }
        }
    }
};

/**
 * Extract colors and put them in a colormap.
 * @param {Colormap} colorMap The colormap to extract pixels to.
 */
ColorMap.prototype.extractColorMap = function(toColorMap) {
    'use strict';
    var x,
        y,
        rx = toColorMap.resX,
        ry = toColorMap.resY;

    for (x = 0; x < toColorMap.width; x += rx) {
        for (y = 0; y < toColorMap.height; y += ry) {
            toColorMap.add(x, y, this.reduceToMax(x, y, rx, ry));
        }
    }
    this.subtract(toColorMap);
};
