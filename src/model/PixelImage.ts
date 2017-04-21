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
import * as Pixels from './Pixels';
import { OrderedDithering } from'../conversion/OrderedDithering';
import { ColorMap } from './ColorMap';

export class PixelImage {

    private orderedDithering = new OrderedDithering();
    private pixelIndex: number[][];

    width: number;
    height: number;
    pWidth: number;  // aspect width of one pixel
    pHeight: number; // aspect height of one pixel
    colorMaps: ColorMap[];

    mappingWeight: number[];

    constructor(width: number, height: number, pWidth: number = 1, pHeight: number = 1) {
        // public properties
        this.width = width;
        this.height = height;
        this.pWidth = pWidth;
        this.pHeight = pHeight;
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
      Returns the index of the ColorMap
    */
    findColorInMap(x: number, y: number, realColor: number[]): number {
        if (x === undefined) {
            throw new Error("x is mandatory.");
        }
        if (y === undefined) {
            throw new Error("y is mandatory.");
        }

        for (let i: number = 0; i < this.colorMaps.length; i += 1) {
            let colorMap: ColorMap = this.colorMaps[i];
            let mappedIndex: number = colorMap.palette.mapPixel(
                this.orderedDithering.offsetColor(realColor, x, y));
            if (mappedIndex === colorMap.get(x, y)) {
                return i;
            }
        }
        return undefined;
    }


    /**
     * Try all ColorMaps to find an area that is not defined yet.
     * If found, map realColor to the ColorMap's palette and claim the area.
     * Returns index into the found ColorMap.
     */
    tryClaimUnusedInMap(realColor: number[], x: number, y: number): number {
        if (x === undefined) {
            throw new Error("x is mandatory.");
        }
        if (y === undefined) {
            throw new Error("y is mandatory.");
        }

        for (let i = 0; i < this.colorMaps.length; i += 1) {
            if (this.colorMaps[i].get(x, y) === undefined) {
                const colorMap = this.colorMaps[i],
                    color = colorMap.palette.mapPixel(
                        this.orderedDithering.offsetColor(realColor, x, y));
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
    map(pixel: number[], x: number, y: number): number {
        let minVal: number,
            minI: number = 0;

        // determine closest pixel in palette (ignoring alpha)
        for (let i: number = 0; i < this.colorMaps.length; i += 1) {
            let colorMap: ColorMap = this.colorMaps[i],
                color: number[] = colorMap.getColor(x, y),
                d: number = Pixels.getDistance(pixel, this.orderedDithering.offsetColor(color, x, y));
            if (minVal === undefined || d < minVal) {
                minVal = d;
                minI = i;
            }
        }
        return minI;
    }

    setPixelIndex(x: number, y: number, index: number): void {
        if (this.pixelIndex[y] === undefined) {
            this.pixelIndex[y] = [];
        }
        this.pixelIndex[y][x] = index;
    }

    getPixelIndex(x: number, y: number): number {
        const row: number[] = this.pixelIndex[y];
        return row !== undefined ? row[x] : undefined;
    }

    /**
     * Map a 'real' color to the best match in the image.
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @param {Array} pixel - Pixel values [r, g, b]
     */
    poke(x: number, y: number, realColor: number[]): void {

        // idea: do 'smart' poking in a separate class, with dependency to dithering

        // try to reuse existing color map that has an exact fit for this color
        let colorMapIndex: number = this.findColorInMap(x, y, realColor);
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
    peek(x: number, y: number): number[] {
        // get the ColorMap for the color
        const colorMapIndex = this.getPixelIndex(x, y);
        if (colorMapIndex === undefined) {
            return undefined;
        }

        // get the palette index from the ColorMap
        const colorMap = this.colorMaps[colorMapIndex],
            paletteIndex = colorMap.get(x, y);
            
        // return the color from the palette
        return paletteIndex !== undefined ? colorMap.palette.get(paletteIndex) : [0, 0, 0, 0];
    }

    addColorMap(colorMap: ColorMap): void {
        this.colorMaps.push(colorMap);
    }

}
