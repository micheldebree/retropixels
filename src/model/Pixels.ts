/**
 * Utility for calculations involving pixels
 */

export class Pixels {

    emptyPixel: number[] = [0, 0, 0, 0];

    private constructor() { }

    /**
     * Add one pixel to another by adding all channels.
     * @param  {number[]} one   One pixel
     * @param  {number[]} other Another pixel
     * @return {number[]}       The pixels added together.
     */
    static add(one: number[], other: number[]): number[] {
        return [one[0] + other[0], one[1] + other[1], one[2] + other[2], one[3] + other[3]];
    }

    /**
     * Convert from an RGB pixel to YUV.
     * @param  {number[]} pixel The pixel to convert.
     * @return {number[]}       The result
     */
    private static toYUV(pixel: number[]): number[] {
        if (pixel === undefined) {
            throw new Error("Pixel is mandatory.");
        }
        return [
            pixel[0] * 0.299 + pixel[1] * 0.587 + pixel[2] * 0.114,
            pixel[0] * -0.14713 + pixel[1] * -0.28886 + pixel[2] * 0.436,
            pixel[0] * 0.615 + pixel[1] * -0.51499 + pixel[2] * -0.10001
        ];
    }

    /**
     * Get the Euclidian distance between two pixels.
     * @param  {number[]} onePixel   One pixel
     * @param  {number[]} otherPixel Another pixel
     * @return {number}              The Euclidian distance between the two pixels. 
     */
    static getDistance(onePixel: number[], otherPixel: number[]): number {
        const weight: number[] = [1, 1, 1];

        if (onePixel === undefined) {
            throw new Error("onePixel is mandatory.");
        }
        if (otherPixel === undefined) {
            throw new Error("otherPixel is mandatory.");
        }
        onePixel = Pixels.toYUV(onePixel);
        otherPixel = Pixels.toYUV(otherPixel);

        return Math.sqrt(
            Math.pow(weight[0] * (onePixel[0] - otherPixel[0]), 2) +
            Math.pow(weight[1] * (onePixel[1] - otherPixel[1]), 2) +
            Math.pow(weight[2] * (onePixel[2] - otherPixel[2]), 2)
        );
    }

}
