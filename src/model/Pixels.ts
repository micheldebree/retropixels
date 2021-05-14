import IImageData from './IImageData';

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

  // Set the pixel at (x,y)
  public static poke(imageData: IImageData, x: number, y: number, pixel: number[]): void {
    if (pixel !== undefined) {
      const i: number = this.coordsToIndex(imageData, x, y);
      if (i !== undefined) {
        /* eslint-disable no-param-reassign,prefer-destructuring */
        imageData.data[i] = pixel[0];
        imageData.data[i + 1] = pixel[1];
        imageData.data[i + 2] = pixel[2];
        imageData.data[i + 3] = pixel[3];
        /* eslint-enable no-param-reassign,prefer-destructuring */
      }
    }
  }

  // Get the pixel at (x,y)
  public static peek(imageData: IImageData, x: number, y: number): number[] {
    return this.peekAtIndex(imageData, this.coordsToIndex(imageData, x, y));
  }

  private static peekAtIndex(imageData: IImageData, index: number): number[] {
    if (index !== undefined) {
      return [imageData.data[index], imageData.data[index + 1], imageData.data[index + 2], imageData.data[index + 3]];
    }
    return Pixels.emptyPixel;
  }

  private static coordsToIndex(imageData: IImageData, x: number, y: number): number {
    const result: number = Math.floor(y) * (imageData.width << 2) + (x << 2);
    return result < imageData.data.length ? result : undefined;
  }

  private static cap(pixelChannel: number): number {
    return Math.min(255, Math.max(0, pixelChannel));
  }
}
