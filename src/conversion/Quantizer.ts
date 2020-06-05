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
// https://github.com/usolved/cie-rgb-converter/blob/master/cie_rgb_converter.js
// https://gist.github.com/manojpandey/f5ece715132c572c80421febebaf66ae
// https://ninedegreesbelow.com/photography/xyz-rgb.html

/**
 * Maps a color to a palette.
 */
export default class Quantizer {
  public colorspace: (pixel: number[]) => number[];

  private palette: Palette;

  constructor(palette: Palette, colorspace: (pixel: number[]) => number[]) {
    this.colorspace = colorspace;
    this.palette = palette;
  }

  private distance = (onePixel: number[], otherPixel: number[]): number => {
    const onePixelConverted = this.colorspace(onePixel);
    const otherPixelConverted = this.colorspace(otherPixel);

    return Math.sqrt(
      (onePixelConverted[0] - otherPixelConverted[0]) ** 2 +
        (onePixelConverted[1] - otherPixelConverted[1]) ** 2 +
        (onePixelConverted[2] - otherPixelConverted[2]) ** 2
    );
  };

  // converters from RGB to other colorspace
  public static colorspaceRGB = (pixel: number[]): number[] => {
    return pixel;
  };

  public static colorspaceRainbow = (pixel: number[]): number[] => {
    return [Quantizer.colorspaceYUV(pixel)[0], 0, 0];
  };

  // SDTV with BT.602
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

    return [r * 41.24 + g * 35.76 + b * 18.05, r * 21.26 + g * 71.52 + b * 7.22, r * 1.93 + g * 11.92 + b * 95.05];
  };

  public static colorspaceLAB = (pixel: number[]): number[] => {
    const xyzPixel = Quantizer.colorspaceXYZ(pixel);
    const refX = 95.047;
    const refY = 100.0;
    const refZ = 108.883;
    const pow = 1 / 3;
    const bla = 16 / 116;

    let x = xyzPixel[0] / refX; // ref_X =  95.047   Observer= 2°, Illuminant= D65
    let y = xyzPixel[1] / refY; // ref_Y = 100.000
    let z = xyzPixel[2] / refZ; // ref_Z = 108.883

    x = x > 0.008856 ? x ** pow : 7.787 * x + bla;
    y = y > 0.008856 ? y ** pow : 7.787 * y + bla;
    z = z > 0.008856 ? z ** pow : 7.787 * z + bla;

    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
  };

  /**
   * Get the best match for a pixel from a palette.
   * @param pixel The pixel color
   * @param palette The palette to map the pixel to
   * @returns The index of the palette entry that contains the best match.
   */
  public mapPixel(pixel: number[]): number {
    // map pixels to [index, distance to pixel],
    // then reduce to just the element with the lowest distance,
    // and return just the index.

    return this.palette.pixels
      .map((palettePixel, index) => [index, this.distance(pixel, palettePixel)])
      .reduce((acc, current) => (current[1] < acc[1] ? current : acc), [null, Number.POSITIVE_INFINITY])[0];
  }

  public static colorspaces = {
    rgb: Quantizer.colorspaceRGB,
    yuv: Quantizer.colorspaceYUV,
    rainbow: Quantizer.colorspaceRainbow,
    ycbcr: Quantizer.colorspaceYCbCr,
    xyz: Quantizer.colorspaceXYZ,
    lab: Quantizer.colorspaceLAB
  };
}
