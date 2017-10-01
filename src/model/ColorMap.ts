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

import { Palette } from './Palette';

export class ColorMap {

    public colors: number[][];
    public palette: Palette;
    public width: number;
    public height: number;
    public resX: number;
    public resY: number;

    constructor(widthVal: number,
                heightVal: number,
                palette: Palette,
                resXVal: number = widthVal,
                resYVal: number = heightVal) {

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
    public isInRange(x: number, y: number): boolean {
        return (x >= 0 && x < this.width && y >= 0 && y < this.height);
    }

    /**
     * Map an image x coordinate to a map x coordinate.
     */
    public mapX(x: number): number {
        return Math.floor(x / this.resX);
    }

    /**
     * Map an image y coordinate to a map y coordinate.
     */
    public mapY(y: number): number {
        return Math.floor(y / this.resY);
    }

    /**
     * Set an area to a certain color.
     * @param {number} x            x coordinate
     * @param {number} y            y coordinate
     * @param {number} paletteIndex
     */
    public put(x: number, y: number, paletteIndex: number): void {
        if (!this.isInRange(x, y)) {
            return;
        }

        const rx: number = this.mapX(x);

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
    public get(x: number, y: number): number {
        const mX: number = this.mapX(x);
        const mY: number = this.mapY(y);

        if (this.colors[mX] !== undefined) {
            return this.colors[mX][mY];
        }
        return undefined;
    }

    /**
     * Get the color at x, y coordinate.
     * @param  {number}   x [description]
     * @param  {number}   y [description]
     * @return {number[]}   [description]
     */
    public getColor(x: number, y: number): number[] {
        const index: number = this.get(x, y);
        if (index === undefined) {
            return undefined;
        }
        return this.palette.get(index);
    }

    // TODO: offset Pixel from the start instead of passing it down
    public isBestFit(pixel: number[], x: number, y: number): boolean {
        return this.palette.mapPixel(pixel) === this.get(x, y);
    }

    public subtract(colorMap: ColorMap): void {
        for (let x: number = 0; x < this.width; x += this.resX) {
            for (let y: number = 0; y < this.height; y += this.resY) {
                if (this.get(x, y) === colorMap.get(x, y)) {
                    this.put(x, y, undefined);
                }
            }
        }
    }
}
