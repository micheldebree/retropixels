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

    return Math.sqrt(
      Math.pow(onePixel[0] - otherPixel[0], 2) +
      Math.pow(onePixel[1] - otherPixel[1], 2) +
      Math.pow(onePixel[2] - otherPixel[2], 2),
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

    let minVal: number;
    let minI: number;
    let i: number = 0;

    const ditheredPixel = this.ditherMatrix.offsetColor(pixel, x, y);

    // determine closest pixel in palette (ignoring alpha)
    for (const palettePixel of palette.pixels) {
      const d: number = this.measurer(ditheredPixel, palettePixel);
      if (minVal === undefined || d < minVal) {
        minVal = d;
        minI = i;
      }
      i++;
    }
    return minI;
  }

}
