/* jshint esversion: 6 */

const Pixels = require('../model/Pixels.js');

class OrderedDithering {

    constructor() {

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


        this.matrix = this.bayer8x8;

        this.all = [{
            key: 'None',
            value: [
                [0]
            ]
        }, {
            key: 'Bayer 2 x 2',
            value: this.bayer2x2
        }, {
            key: 'Bayer 4 x 4',
            value: this.bayer4x4
        }, {
            key: 'Bayer 8 x 8',
            value: this.bayer8x8
        }];
    }

    offsetColor(color, x, y) {
        return Pixels.add(color, this.getColorOffset(x, y));
    }

    getColorOffset(x, y) {
        // N.B. only works for square matrices because assumed length == width!
        const matrix_size = this.matrix[0].length,
            palette_size = 16,
            factor = 1 / (matrix_size * matrix_size),
            value = factor * this.matrix[y % matrix_size][x % matrix_size],

            r = 256 / palette_size,
            offset = r * (value - 0.5);

        // TODO: calculate better r (per channel?)
        return [offset, offset, offset];

    }
}

module.exports = OrderedDithering;
