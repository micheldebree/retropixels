import Palette from '../model/Palette';
import Pixels from '../model/Pixels';

// https://www.easyrgb.com/en/math.php
// https://stackoverflow.com/questions/15408522/rgb-to-xyz-and-lab-colours-conversion
// https://stackoverflow.com/questions/6242114/how-much-worse-is-srgb-than-lab-when-computing-the-eucleidan-distance-between
// https://www.compuphase.com/cmetric.htm
// https://godsnotwheregodsnot.blogspot.com/2012/09/color-space-comparisons.html
// https://en.wikipedia.org/wiki/Color_difference

/**
 * Maps a color to a palette.
 */
export default class Quantizer {
  public distance = (onePixel: number[], otherPixel: number[]): number => {
    return Math.sqrt(
      (onePixel[0] - otherPixel[0]) ** 2 + (onePixel[1] - otherPixel[1]) ** 2 + (onePixel[2] - otherPixel[2]) ** 2
    );
  };

  public distanceYUV = (onePixel: number[], otherPixel: number[]): number => {
    return this.distance(Pixels.toYUV(onePixel), Pixels.toYUV(otherPixel));
  };

  public distanceRainbow = (onePixel: number[], otherPixel: number[]): number => {
    return Math.abs(Pixels.toYUV(onePixel)[0] - Pixels.toYUV(otherPixel)[0]);
  };

  public distanceXYZ = (onePixel: number[], otherPixel: number[]): number => {
    return this.distance(Pixels.sRGBtoXYZ(onePixel), Pixels.sRGBtoXYZ(otherPixel));
  };

  public distanceLAB = (onePixel: number[], otherPixel: number[]): number => {
    return this.distance(Pixels.XYZtoLAB(Pixels.sRGBtoXYZ(onePixel)), Pixels.XYZtoLAB(Pixels.sRGBtoXYZ(otherPixel)));
  };

  // function to measure distance between two pixels
  public measurer: (onePixel: number[], otherPixel: number[]) => number = this.distanceYUV;

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
    // map pixels to [index, distance to pixel],
    // then reduce to just the element with the lowest distance,
    // and return just the index.

    return palette.pixels
      .map((palettePixel, index) => [index, this.measurer(pixel, palettePixel)])
      .reduce((acc, current) => (current[1] < acc[1] ? current : acc), [null, Number.POSITIVE_INFINITY])[0];
  }
}
