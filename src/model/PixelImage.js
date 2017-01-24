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

http://bisqwit.iki.fi/story/howto/dither/jy/
https://people.eecs.berkeley.edu/~dcoetzee/downloads/scolorq/

*/
const Pixels = require('./Pixels.js'),
    OrderedDithering = require('../conversion/OrderedDithering.js'),
    orderedDithering = new OrderedDithering();

class PixelImage {

    constructor(width, height, pWidth, pHeight) {
        // public properties
        this.width = width;
        this.height = height;
        this.pWidth = pWidth === undefined ? 1 : pWidth; // aspect width of one pixel
        this.pHeight = pHeight === undefined ? 1 : pHeight; // aspect height of one pixel
        this.colorMaps = []; // maps x,y to a color
        this.pixelIndex = []; // maps pixel x,y to a colormap

        // weight per pixel channel (RGB or YUV) when calculating distance
        // [1, 1, 1] is equal weight, [1, 0, 0] in combination with YUV is phychedelic mode
        this.mappingWeight = [1, 1, 1];
    }

    /*  
      Find a ColorMap that the color can be mapped on exactly.
      Do this by mapping the color to each ColorMaps's palette and checking if the
      ColorMap has that mapped color at the specified position.
    */
    findColorInMap(x, y, realColor) {
        if (x === undefined) {
            throw new Error("x is mandatory.");
        }
        if (y === undefined) {
            throw new Error("y is mandatory.");
        }

        for (let i = 0; i < this.colorMaps.length; i += 1) {
            // console.log("Finding color " + color + " in map " + i);
            let colorMap = this.colorMaps[i];
            // console.log("Palette is " + colorMap.palette);
            let mappedIndex = colorMap.palette.mapPixel(orderedDithering.offsetColor(realColor, x, y));
            // console.log("mappedIndex is " + mappedIndex);
            if (mappedIndex === colorMap.get(x, y)) {
                // console.log("Found in map " + i);
                return i;
            }
        }
        // console.log("Not found.");
        return undefined;
    }

    tryClaimUnusedInMap(realColor, x, y) {
        if (x === undefined) {
            throw new Error("x is mandatory.");
        }
        if (y === undefined) {
            throw new Error("y is mandatory.");
        }

        for (let i = 0; i < this.colorMaps.length; i += 1) {
            // console.log("Looking for unused spot in colorMap " + i);
            if (this.colorMaps[i].get(x, y) === undefined) {
                // console.log("Found!");
                const colorMap = this.colorMaps[i],
                    color = colorMap.palette.mapPixel(orderedDithering.offsetColor(realColor, x, y));
                colorMap.put(x, y, color);
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
    map(pixel, x, y) {
        let minVal,
            minI = 0;

        // determine closest pixel in palette (ignoring alpha)
        for (let i = 0; i < this.colorMaps.length; i += 1) {
            let colorMap = this.colorMaps[i],
                color = colorMap.getColor(x, y),
                d = Pixels.getDistance(pixel, orderedDithering.offsetColor(color, x, y));
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

    /**
     * Map a 'real' color to the best match in the image.
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @param {Array} pixel - Pixel values [r, g, b]
     */
    poke(x, y, realColor) {

        // idea: do 'smart' poking in a separate class, with dependency to dithering

        // try to reuse existing color map that has the best fit for this color
        let colorMapIndex = this.findColorInMap(x, y, realColor);
        if (colorMapIndex !== undefined) {
            this.setPixelIndex(x, y, colorMapIndex);
            return;
        }

        // else see if there is a map with an empty attribute that we can claim
        colorMapIndex = this.tryClaimUnusedInMap(realColor, x, y);
        if (colorMapIndex !== undefined) {
            this.setPixelIndex(x, y, colorMapIndex);
            return;
        }

        // otherwise just map to the ColorMap that has the closest match at x,y
        colorMapIndex = this.map(realColor, x, y);
        this.setPixelIndex(x, y, colorMapIndex);
    }

    /**
     * Get the color of a particular pixel.
     * @param {int} x X coordinate
     * @param {int} y Y coordinate
     * @returns {Array} Pixel values [r, g, b, a], or an empty pixel if x and y are out of range.
     */
    peek(x, y) {
        // get the ColorMap for the color
        const colorMapIndex = this.getPixelIndex(x, y);
        if (colorMapIndex === undefined) {
            return undefined;
        }

        // get the palette index from the ColorMap
        const colorMap = this.colorMaps[colorMapIndex],
            paletteIndex = colorMap.get(x, y);
            
        // return the color from the palette
        return paletteIndex !== undefined ? colorMap.palette.get(paletteIndex) : PixelImage.emptyPixel;
    }

    addColorMap(colorMap) {
        this.colorMaps.push(colorMap);
    }

}

module.exports = PixelImage;
