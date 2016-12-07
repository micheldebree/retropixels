/* jshint esversion: 6 */
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
const Pixels = require('./Pixels.js');

class PixelImage {

    constructor(width, height, pWidth, pHeight) {
        // public properties
        this.width = width;
        this.height = height;
        this.pWidth = pWidth === undefined ? 1 : pWidth; // aspect width of one pixel
        this.pHeight = pHeight === undefined ? 1 : pHeight; // aspect height of one pixel
        this.colorMaps = []; // maps x,y to a color
        this.palette = undefined; // the palette for all colors used in this image
        this.pixelIndex = []; // maps pixel x,y to a colormap
        this.ditherOffset = []; // offset for dithering used when mapping color
        this.dither = [
            [0]
        ]; // n x n bayer matrix for ordered dithering
        this.errorDiffusionDither = function() {};

        // weight per pixel channel (RGB or YUV) when calculating distance
        // [1, 1, 1] is equal weight, [1, 0, 0] in combination with YUV is phychedelic mode
        this.mappingWeight = [1, 1, 1];
    }

    findColorInMap(x, y, color) {
        for (let i = 0; i < this.colorMaps.length; i += 1) {
            if (color === this.colorMaps[i].getColor(x, y)) {
                return i;
            }
        }
        return undefined;
    }

    /**
     * Map a pixel to the closest available Colormap.
     * @param {int} x X coordinate
     * @param {int} y Y coordinate
     * @returns {int} Colormap index for the closest Colormap
     */
    map(pixel, x, y, offsetPixel) {
        let minVal,
            minI = 0;

        // determine closest pixel in palette (ignoring alpha)
        for (let i = 0; i < this.colorMaps.length; i += 1) {
            let otherIndex = this.colorMaps[i].getColor(x, y);
            let d = Pixels.getDistance(pixel, this.palette.get(otherIndex), offsetPixel, this.mappingWeight);
            if (minVal === undefined || d < minVal) {
                minVal = d;
                minI = i;
            }
        }
        return minI;
    }

    setPixelIndex(x, y, index) {
        if (this.pixelIndex[y] === undefined) {
            this.pixelIndex[y] = [];
        }
        this.pixelIndex[y][x] = index;
    }

    getPixelIndex(x, y) {
        const row = this.pixelIndex[y];
        return row !== undefined ? row[x] : undefined;
    }

    getPaletteIndex(x, y) {
        const ci = this.getPixelIndex(x, y);
        return ci !== undefined ? this.colorMaps[ci].getColor(x, y) : undefined;
    }

    getDitherOffset(x, y) {
        const row = this.ditherOffset[y];
        if (row !== undefined && row[x] !== undefined) {
            return row[x];
        }
        return Pixels.emptyPixel;
    }

    /**
     * Set the value for a particular pixel.
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @param {Array} pixel - Pixel values [r, g, b]
     */
    poke(x, y, pixel) {
        const offsetPixel = this.getDitherOffset(x, y),
              // map to closest color in palette
              mappedIndex = this.palette.mapPixel(pixel, offsetPixel, this.mappingWeight),
              // use the error for dithering
              mappedPixel = this.palette.get(mappedIndex),
              error = Pixels.substract(mappedPixel, pixel);
              
        this.orderedDither(x, y, pixel);
        this.errorDiffusionDither(this, x, y, error);

        // try to reuse existing color map
        let colorMap = this.findColorInMap(x, y, mappedIndex);

        // else see if there is a map with an empty pixel
        if (colorMap === undefined) {
            colorMap = this.findColorInMap(x, y, undefined);
        }

        if (colorMap !== undefined) {
            this.colorMaps[colorMap].add(x, y, mappedIndex);
        } else {
            colorMap = this.map(pixel, x, y, offsetPixel);
        }
        this.setPixelIndex(x, y, colorMap);
    }

    /**
     * Get the value of a particular pixel.
     * @param {int} x X coordinate
     * @param {int} y Y coordinate
     * @returns {Array} Pixel values [r, g, b, a], or an empty pixel if x and y are out of range.
     */
    peek(x, y) {
        const paletteIndex = this.getPaletteIndex(x, y);
        return paletteIndex !== undefined ? this.palette.get(paletteIndex) : PixelImage.emptyPixel;
    }

    setDitherOffset(x, y, offsetPixel) {
        if (x < this.width && y < this.height) {
            if (this.ditherOffset[y] === undefined) {
                this.ditherOffset[y] = [];
            }
            this.ditherOffset[y][x] = offsetPixel;
        }
    }

    addDitherOffset(x, y, offsetPixel) {
        const currentOffset = this.getDitherOffset(x, y);
        this.setDitherOffset(x, y, Pixels.add(currentOffset, offsetPixel));
    }

    orderedDither(x, y) {
        const offset = this.dither[y % this.dither.length][x % this.dither.length];
        this.addDitherOffset(x + 1, y, [offset, offset, offset]);
    }
    addColorMap(colorMap) {
        this.colorMaps.push(colorMap);
    }

}

module.exports = PixelImage;
