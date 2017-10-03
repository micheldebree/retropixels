import { Pixels } from './Pixels';

export class Palette {

    public pixels: number[][];

    constructor(pixels: number[][]) {
        this.pixels = pixels === undefined ? [] : pixels;
    }

    public get(index: number): number[] {
        return this.pixels[index];
    }

    /**
     * Map a pixel to the closest available color in the palette.
     * @returns the index into the palette
     */
    public mapPixel(pixel: number[]): number {
        if (pixel === undefined) {
            throw new Error('pixel is mandatory.');
        }

        let minVal: number;
        let minI: number;

        // determine closest pixel in palette (ignoring alpha)
        this.pixels.forEach((anotherPixel: number[], i: number) => {
            const d: number = Pixels.getDistance(pixel, anotherPixel);
            if (minVal === undefined || d < minVal) {
                minVal = d;
                minI = i;
            }
        });
        return minI;
    }
}
