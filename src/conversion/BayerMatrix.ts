import { Pixels } from '../model/Pixels';

export class BayerMatrix {

    private static sizePresets = {
        'none': [[0]],
        'bayer2x2': [
            [1, 3],
            [4, 2],
        ],
        'bayer4x4': [
            [1, 9, 3, 11],
            [13, 5, 15, 7],
            [4, 12, 2, 10],
            [16, 8, 14, 6],
        ],
        'bayer8x8': [
            [1, 49, 13, 61, 4, 52, 16, 64],
            [33, 17, 45, 29, 36, 20, 48, 31],
            [9, 57, 5, 53, 12, 60, 8, 56],
            [41, 25, 37, 21, 44, 28, 40, 24],
            [3, 51, 15, 63, 2, 50, 14, 62],
            [35, 19, 47, 31, 34, 18, 46, 30],
            [11, 59, 7, 55, 10, 58, 6, 54],
            [43, 27, 39, 23, 42, 26, 38, 22],
        ],
    };

    private matrix: number[][] = [];

    // depth: 64 for 8x8

    constructor(sizePreset: string, depth: number) {

        const sourceMatrix: number[][] = BayerMatrix.sizePresets[sizePreset];
        const matrixSize = sourceMatrix[0].length;
        const factor: number = 1 / (matrixSize * matrixSize);

        let rowIndex = 0;
        for (const row of sourceMatrix) {
            this.matrix[rowIndex] = [];
            let elementIndex = 0;
            for (const element of row) {
                this.matrix[rowIndex][elementIndex++] = depth * (factor * element - 0.5);
            }
            rowIndex++;
        }
        console.log('a ' + this.matrix);

    }

    public offsetColor(color: number[], x: number, y: number): number[] {
        const matrixSize = this.matrix[0].length;
        const offset: number = this.matrix[x % matrixSize][y % matrixSize];
        return Pixels.add(color, [offset, offset, offset]);
    }
}
