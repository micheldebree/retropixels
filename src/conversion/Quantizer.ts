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
// https://bottosson.github.io/posts/oklab/
// https://stackoverflow.com/questions/9018016/how-to-compare-two-colors-for-similarity-difference
// http://www.colorwiki.com/wiki/Delta_E:_The_Color_Difference
// https://techkonusa.com/a-simple-review-of-cie-%CE%B4e-color-difference-equations/

/**
 * Maps a color to a palette.
 */
export default class Quantizer {
  public colorspace: (pixel: number[]) => number[];

  public palette: Palette;

  constructor(palette: Palette, colorspace: (pixel: number[]) => number[]) {
    this.colorspace = colorspace;
    // convert palette to colorspace first
    this.palette = new Palette(palette.pixels.map(p => colorspace(p)));
  }

  public distance = (realPixel: number[], palettePixel: number[]): number => {
    const realPixelConverted = this.colorspace(realPixel);

    return Math.sqrt(
      (realPixelConverted[0] - palettePixel[0]) ** 2 +
        (realPixelConverted[1] - palettePixel[1]) ** 2 +
        (realPixelConverted[2] - palettePixel[2]) ** 2
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
    let r = pixel[0];
    let g = pixel[1];
    let b = pixel[2];

    r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
    g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
    b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;

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

  public static colorspaceOklab = (pixel: number[]): number[] => {
    const r: number = pixel[0];
    const g: number = pixel[1];
    const b: number = pixel[2];

    const l: number = 0.412165612 * r + 0.536275208 * g + 0.0514575653 * b;
    const m: number = 0.211859107 * r + 0.6807189584 * g + 0.107406579 * b;
    const s: number = 0.0883097947 * r + 0.2818474174 * g + 0.6302613616 * b;

    return [
      0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
      1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
      0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
    ];
  };

  /**
   * Get the best match for a pixel from a palette.
   * @param pixel The pixel color
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
    lab: Quantizer.colorspaceLAB,
    oklab: Quantizer.colorspaceOklab
  };
}
