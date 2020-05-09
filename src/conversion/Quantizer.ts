import Palette from '../model/Palette';

// https://www.easyrgb.com/en/math.php
// https://stackoverflow.com/questions/15408522/rgb-to-xyz-and-lab-colours-conversion
// https://stackoverflow.com/questions/6242114/how-much-worse-is-srgb-than-lab-when-computing-the-eucleidan-distance-between
// https://www.compuphase.com/cmetric.htm
// https://godsnotwheregodsnot.blogspot.com/2012/09/color-space-comparisons.html
// https://en.wikipedia.org/wiki/Color_difference
// https://bisqwit.iki.fi/jutut/colorquant/
// https://sistenix.com/rgb2ycbcr.html
// https://stackoverflow.com/questions/7086820/convert-rgb-to-ycbcr-c-code

/**
 * Maps a color to a palette.
 */
export default class Quantizer {
  public distance = (onePixel: number[], otherPixel: number[]): number => {
    const onePixelConverted = this.colorspace(onePixel);
    const otherPixelConverted = this.colorspace(otherPixel);

    return Math.sqrt(
      (onePixelConverted[0] - otherPixelConverted[0]) ** 2 +
        (onePixelConverted[1] - otherPixelConverted[1]) ** 2 +
        (onePixelConverted[2] - otherPixelConverted[2]) ** 2
    );
  };

  public colorspace: (pixel: number[]) => number[] = Quantizer.colorspaceRGB;

  // converters from RGB to other colorspace
  public static colorspaceRGB = (pixel: number[]): number[] => {
    return pixel;
  };

  public static colorspaceRainbow = (pixel: number[]): number[] => {
    return [Quantizer.colorspaceYUV(pixel)[0], 0, 0];
  };

  // SDTV with BT.601
  // https://en.wikipedia.org/wiki/YUV
  public static colorspaceYUV = (pixel: number[]): number[] => {
    return [
      pixel[0] * 0.299 + pixel[1] * 0.587 + pixel[2] * 0.114,
      pixel[0] * -0.14713 + pixel[1] * -0.28886 + pixel[2] * 0.436,
      pixel[0] * 0.615 + pixel[1] * -0.51499 + pixel[2] * -0.10001
    ];
  };

  public static colorspaceYCbCr = (pixel: number[]): number[] => {
    const [r, g, b] = pixel;
    return [
      0.299 * r + 0.587 * g + 0.114 * b,
      -0.16874 * r - 0.33126 * g + 0.5 * b,
      0.5 * r - 0.41869 * g - 0.08131 * b
    ];
  };

  public static colorspaceXYZ = (pixel: number[]): number[] => {
    let r = pixel[0] / 255;
    let g = pixel[1] / 255;
    let b = pixel[2] / 255;

    r = r > 0.04045 ? (r = ((r + 0.055) / 1.055) ** 2.4) : r / 12.92;
    g = g > 0.04045 ? (g = ((g + 0.055) / 1.055) ** 2.4) : g / 12.92;
    b = b > 0.04045 ? (b = ((b + 0.055) / 1.055) ** 2.4) : b / 12.92;

    r *= 100;
    g *= 100;
    b *= 100;

    return [
      r * 0.4124 + g * 0.3576 + b * 0.1805,
      r * 0.2126 + g * 0.7152 + b * 0.0722,
      r * 0.0193 + g * 0.1192 + b * 0.9505
    ];
  };

  public static colorspacLAB = (pixel: number[]): number[] => {
    const xyzPixel = Quantizer.colorspaceXYZ(pixel);
    const refX = 95.047;
    const refY = 100.0;
    const refZ = 108.883;
    const pow = 1 / 3;

    let x = xyzPixel[0] / refX; // ref_X =  95.047   Observer= 2°, Illuminant= D65
    let y = xyzPixel[1] / refY; // ref_Y = 100.000
    let z = xyzPixel[2] / refZ; // ref_Z = 108.883

    x = x > 0.008856 ? x ** pow : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? y ** pow : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? z ** pow : 7.787 * z + 16 / 116;

    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
  };

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
      .map((palettePixel, index) => [index, this.distance(pixel, palettePixel)])
      .reduce((acc, current) => (current[1] < acc[1] ? current : acc), [null, Number.POSITIVE_INFINITY])[0];
  }

  public static colorspaces = {
    RGB: Quantizer.colorspaceRGB,
    YUV: Quantizer.colorspaceYUV,
    Unicorn: Quantizer.colorspaceRainbow,
    YCbCr: Quantizer.colorspaceYCbCr,
    XYZ: Quantizer.colorspaceXYZ,
    LAB: Quantizer.colorspacLAB
  };
}
