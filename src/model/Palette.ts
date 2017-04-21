import * as Pixels from './Pixels';

export class Palette {

    pixels: number[][];

    constructor(pixels: number[][]) {
        this.pixels = pixels === undefined ? [] : pixels;
    }
    
    get(index: number): number[] {
        return this.pixels[index];
    }

    /**
     * Map a pixel to the closest available color in the palette.
     * @returns the index into the palette
     */
    mapPixel(pixel: number[]): number {
        if (pixel === undefined) {
          throw new Error("pixel is mandatory.");
        }
      
        let minVal: number;
        let minI: number;

        // determine closest pixel in palette (ignoring alpha)
        for (let i: number = 0; i < this.pixels.length; i += 1) {
            let d: number = Pixels.getDistance(pixel, this.pixels[i]);
            if (minVal === undefined || d < minVal) {
                minVal = d;
                minI = i;
            }
        }
        return minI;
    }
}