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

  private static cap(pixelChannel: number): number {
    return Math.min(255, Math.max(0, pixelChannel));
  }
}
