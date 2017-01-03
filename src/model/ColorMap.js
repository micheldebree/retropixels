/* jshint esversion: 6 */
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

class ColorMap {

    constructor(widthVal, heightVal, palette, resXVal = widthVal, resYVal = heightVal) {
        this.colors = [];
        this.palette = palette;
        this.width = widthVal;
        this.height = heightVal;
        this.resX = resXVal;
        this.resY = resYVal; 
    }

    /**
     * Is a coordinate in range?
     */
    isInRange(x, y) {
        return (x >= 0 && x < this.width && y >= 0 && y < this.height);
    }

    /**
     * Map an image x coordinate to a map x coordinate.
     */
    mapX(x) {
        return Math.floor(x / this.resX);
    }

    /**
     * Map an image y coordinate to a map y coordinate.
     */
    mapY(y) {
        return Math.floor(y / this.resY);
    }

    /**
     * Set an area to a certain color.
     * TODO: rename to put
     */
    put(x, y, paletteIndex) {
        if (!this.isInRange(x, y)) {
            return;
        }

        const rx = this.mapX(x);

        // add it to the color map
        if (this.colors[rx] === undefined) {
            this.colors[rx] = [];
        }
        this.colors[rx][this.mapY(y)] = paletteIndex;
    }

    /**
     * Get the palette index at x, y coordinate.
     * TODO: rename to getIndex
     */
    get(x, y) {
        const mX = this.mapX(x),
            mY = this.mapY(y);

        if (this.colors[mX] !== undefined) {
            return this.colors[mX][mY];
        }
        return undefined;
    }

    getColor(x, y) {
        const index = this.get(x, y);
        if (index === undefined) {
            return undefined;
        }
        return this.palette.get(index);
    }
    
    // TODO: offset Pixel from the start instead of passing it down
    isBestFit(pixel, x, y, weight) {
      return this.palette.mapPixel(pixel, weight) === get(x, y);
    }

    subtract(colorMap) {
        for (let x = 0; x < this.width; x += this.resX) {
            for (let y = 0; y < this.height; y += this.resY) {
                if (this.get(x, y) === colorMap.get(x, y)) {
                    this.put(x, y, undefined);
                }
            }
        }
    }
}
module.exports = ColorMap;
