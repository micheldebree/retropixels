import { BayerMatrix } from '../conversion/BayerMatrix';
import { Palette } from '../model/Palette';
import { Pixels } from '../model/Pixels';

/**
 * Maps a color to a palette.
 */
export class Quantizer {

    public static distanceYUV = (onePixel: number[], otherPixel: number[]) => {
        onePixel = Pixels.toYUV(onePixel);
        otherPixel = Pixels.toYUV(otherPixel);
        // const weight: number[] = [1, 0, 0.25];
        // const weight: number[] = [1, 0.5, 0];
        const weight: number[] = [1, 1, 1];
        // const weight: number[] = [1, 0, 0];

        return Math.sqrt(
            weight[0] * Math.pow(onePixel[0] - otherPixel[0], 2) +
            weight[1] * Math.pow(onePixel[1] - otherPixel[1], 2) +
            weight[2] * Math.pow(onePixel[2] - otherPixel[2], 2),
        );
    }

    public static distanceRGB = (onePixel: number[], otherPixel: number[]) => {
        return Math.sqrt(
            Math.pow(onePixel[0] - otherPixel[0], 2) +
            Math.pow(onePixel[1] - otherPixel[1], 2) +
            Math.pow(onePixel[2] - otherPixel[2], 2),
        );
    }

    public static distanceRainbow = (onePixel: number[], otherPixel: number[]) => {
        return Math.abs(Pixels.toYUV(onePixel)[0] - Pixels.toYUV(otherPixel)[0]);
    }

    public measurer: (onePixel: number[], otherPixel: number[]) => number = Quantizer.distanceYUV;
    public ditherMatrix: BayerMatrix = new BayerMatrix('none', 0);

    /**
     * Get the best match for a pixel from a palette.
     * X and Y coordinates are provided for dithering.
     * @param x X coordinate of the pixel
     * @param y Y coordinate of the pixel
     * @param pixel The pixel color
     * @param palette The palette to map the pixel to
     * @returns The index of the palette entry that contains the best match.
     */
    public mapPixel(x: number, y: number, pixel: number[], palette: Palette): number {

        const ditheredPixel = this.ditherMatrix.offsetColor(pixel, x, y);

        // map pixels to [index, distance to pixel],
        // then reduce to just the element with the lowest distance,
        // and return just the index.
        return palette.pixels
            .map((el, index) => [index, this.measurer(ditheredPixel, el)])
            .reduce((acc, current) => current[1] < acc[1] ? current : acc
                , [null, Number.POSITIVE_INFINITY])[0];
    }

}
