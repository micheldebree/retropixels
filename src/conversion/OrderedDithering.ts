import { Pixels } from '../model/Pixels';

/**
 * Applies ordered dithering with a Bayer matrix.
 */
export class OrderedDithering {

    matrix: number[][];

    // presets
    none: number[][];
    bayer2x2: number[][];
    bayer4x4: number[][];
    bayer8x8: number[][];

    constructor() {

        // preset matrices {{{

        this.none = [[0]];

        this.bayer2x2 = [
            [1, 3],
            [4, 2]
        ];

        this.bayer4x4 = [
            [1, 9, 3, 11],
            [13, 5, 15, 7],
            [4, 12, 2, 10],
            [16, 8, 14, 6]
        ];

        this.bayer8x8 = [
            [1, 49, 13, 61, 4, 52, 16, 64],
            [33, 17, 45, 29, 36, 20, 48, 31],
            [9, 57, 5, 53, 12, 60, 8, 56],
            [41, 25, 37, 21, 44, 28, 40, 24],
            [3, 51, 15, 63, 2, 50, 14, 62],
            [35, 19, 47, 31, 34, 18, 46, 30],
            [11, 59, 7, 55, 10, 58, 6, 54],
            [43, 27, 39, 23, 42, 26, 38, 22]
        ];
        // }}}

        // default
        this.matrix = this.bayer8x8;

    }

    /**
     * Offset all channels in a pixel color according to the Bayer matrix.
     * @param  {number[]} color The pixel color to offset.
     * @param  {number}   x     The x coordinate of the pixel.
     * @param  {number}   y     The y coordinate of the pixel
     * @return {number[]}       The offset pixel color.
     */
    offsetColor(color: number[], x: number, y: number): number[] {
        return Pixels.add(color, this.getColorOffset(x, y));
    }

    getColorOffset(x: number, y: number): number[] {
        // N.B. only works for square matrices because assumed length == width!
        const matrix_size: number = this.matrix[0].length,
            // TODO: unfix palette size
            palette_size: number = 16,
            factor: number = 1 / (matrix_size * matrix_size),
            value: number = factor * this.matrix[y % matrix_size][x % matrix_size],
            // TODO: calculate better r (per channel?)
            r: number = 256 / palette_size,
            offset: number = r * (value - 0.5);

        return [offset, offset, offset];

    }

}


