/**
 * Utility for calculations involving pixels
 */
export default class Pixels {
  public static emptyPixel: number[] = [0, 0, 0, 0];

  /**
   * Add one pixel to another by adding all channels.
   * @param  {number[]} one   One pixel
   * @param  {number[]} other Another pixel
   * @return {number[]}       The pixels added together.
   */
  public static add(one: number[], other: number[]): number[] {
    return [
      Pixels.cap(one[0] + other[0]),
      Pixels.cap(one[1] + other[1]),
      Pixels.cap(one[2] + other[2]),
      Pixels.cap(one[3] + other[3])
    ];
  }

  /**
   * Convert from an RGB pixel to YUV.
   * SDTV with BT.601
   * https://en.wikipedia.org/wiki/YUV
   * @param  {number[]} pixel The pixel to convert.
   * @return {number[]}       The result
   */
  public static toYUV(pixel: number[]): number[] {
    if (pixel === undefined) {
      throw new Error('Pixel is mandatory.');
    }
    return [
      pixel[0] * 0.299 + pixel[1] * 0.587 + pixel[2] * 0.114,
      pixel[0] * -0.14713 + pixel[1] * -0.28886 + pixel[2] * 0.436,
      pixel[0] * 0.615 + pixel[1] * -0.51499 + pixel[2] * -0.10001
    ];
  }

  // HDTV with BT.709
  public static toYUV2(pixel: number[]): number[] {
    if (pixel === undefined) {
      throw new Error('Pixel is mandatory.');
    }
    return [
      pixel[0] * 0.2126 + pixel[1] * 0.7152 + pixel[2] * 0.0722,
      pixel[0] * -0.09991 + pixel[1] * -0.33609 + pixel[2] * 0.436,
      pixel[0] * 0.615 + pixel[1] * -0.55861 + pixel[2] * -0.05639
    ];
  }

  // convert standard rgb to XYZ
  public static sRGBtoXYZ(sRgbPixel: number[]): number[] {
    let r = sRgbPixel[0] / 255;
    let g = sRgbPixel[1] / 255;
    let b = sRgbPixel[2] / 255;

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
  }

  public static XYZtoLAB(xyzPixel: number[]): number[] {
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
  }

  private static cap(pixelChannel: number): number {
    return Math.min(255, Math.max(0, pixelChannel));
  }
}
