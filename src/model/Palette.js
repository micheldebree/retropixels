/* jshint esversion: 6 */
const Pixels = require('./Pixels.js');

class Palette {

    constructor(pixels) {
        this.pixels = pixels === undefined ? [] : pixels;
    }
    
    get(index) {
        return this.pixels[index];
    }

    /**
     * Map a pixel to the closest available color in the palette.
     * @returns the index into the palette
     */
    mapPixel(pixel, offset, weight) {
        let minVal,
            minI;

        // determine closest pixel in palette (ignoring alpha)
        for (let i = 0; i < this.pixels.length; i += 1) {
            let d = Pixels.getDistance(pixel, this.pixels[i], offset, weight);
            if (minVal === undefined || d < minVal) {
                minVal = d;
                minI = i;
            }
        }
        return minI;
    }
}

module.exports = Palette;
