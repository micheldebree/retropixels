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

module.exports = ColorMap;