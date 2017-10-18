import { Quantizer } from '../conversion/Quantizer';
import { ColorMap } from './ColorMap';
import { Palette } from './Palette';

export class PixelImage {

    public width: number;
    public height: number;
    public pWidth: number;  // aspect width of one pixel
    public pHeight: number; // aspect height of one pixel
    public colorMaps: ColorMap[];

    public quantizer: Quantizer = new Quantizer();

    private pixelIndex: number[][];

    constructor(width: number, height: number, pWidth: number = 1, pHeight: number = 1) {
        // public properties
        this.width = width;
        this.height = height;
        this.pWidth = pWidth;
        this.pHeight = pHeight;
        this.colorMaps = []; // maps x,y to a color
        this.pixelIndex = []; // maps pixel x,y to a colormap
    }

    /*
      Find a ColorMap that the color can be mapped on exactly.
      Do this by mapping the color to each ColorMaps's palette and checking if the
      ColorMap has that mapped color at the specified position.
      Returns the index of the ColorMap
    */
    public findColorInMap(x: number, y: number, realColor: number[]): number {

        let i: number = 0;

        for (const colorMap of this.colorMaps) {
            const mappedIndex: number = this.quantizer.mapPixel(x, y, realColor, colorMap.palette);
            if (mappedIndex === colorMap.get(x, y)) {
                return i;
            }
            i++;
        }
        return undefined;
    }

    /**
     * Try all ColorMaps to find an area that is not defined yet.
     * If found, map realColor to the ColorMap's palette and claim the area.
     * Returns index into the found ColorMap.
     */
    public tryClaimUnusedInMap(x: number, y: number, realColor: number[]): number {

        let i: number = 0;

        for (const colorMap of this.colorMaps) {
            if (colorMap.get(x, y) === undefined) {
                const color = this.quantizer.mapPixel(x, y, realColor, colorMap.palette);
                colorMap.put(x, y, color);
                return i;
            }
            i++;
        }
        return undefined;
    }

    /**
     * Map a pixel to the closest available Colormap.
     * @param {int} x X coordinate
     * @param {int} y Y coordinate
     * @returns {int} Colormap index for the closest Colormap
     */
    public map(pixel: number[], x: number, y: number): number {

        // determine closest pixel in palette (ignoring alpha)
        const palette = new Palette([]);
        for (const colorMap of this.colorMaps) {
            palette.pixels.push(colorMap.getColor(x, y));
        }
        return this.quantizer.mapPixel(x, y, pixel, palette);
    }

    // TODO: remove; make fixed pixel grid on construction
    public setPixelIndex(x: number, y: number, index: number): void {
        if (this.pixelIndex[y] === undefined) {
            this.pixelIndex[y] = [];
        }
        this.pixelIndex[y][x] = index;
    }

    public getPixelIndex(x: number, y: number): number {
        const row: number[] = this.pixelIndex[y];
        return row !== undefined ? row[x] : undefined;
    }

    /**
     * Map a 'real' color to the best match in the image.
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @param {Array} pixel - Pixel values [r, g, b]
     */
    public poke(x: number, y: number, realColor: number[]): void {

        // idea: do 'smart' poking in a separate class, with dependency to dithering

        // try to reuse existing color map that has an exact fit for this color
        let colorMapIndex: number = this.findColorInMap(x, y, realColor);
        if (colorMapIndex !== undefined) {
            this.setPixelIndex(x, y, colorMapIndex);
            return;
        }

        // else see if there is a map with an empty attribute that we can claim
        colorMapIndex = this.tryClaimUnusedInMap(x, y, realColor);
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
    public peek(x: number, y: number): number[] {
        // get the ColorMap for the color
        const colorMapIndex = this.getPixelIndex(x, y);
        if (colorMapIndex === undefined) {
            return undefined;
        }

        // get the palette index from the ColorMap
        const colorMap = this.colorMaps[colorMapIndex];
        const paletteIndex = colorMap.get(x, y);

        // return the color from the palette
        return paletteIndex !== undefined ? colorMap.palette.get(paletteIndex) : [0, 0, 0, 0];
    }

    public addColorMap(colorMap: ColorMap): void {
        this.colorMaps.push(colorMap);
    }

    public debugColorMaps(): PixelImage[] {

        const result: PixelImage[] = [];

        for (const colorMap of this.colorMaps) {
            const pixelImage = new PixelImage(this.width, this.height, this.pWidth, this.pHeight);
            pixelImage.colorMaps.push(colorMap);
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    pixelImage.setPixelIndex(x, y, 0);
                }
            }
            result.push(pixelImage);

        }
        return result;
    }
}
