import { IImageData } from './ImageDataInterface';
import { Pixels } from './Pixels';

export class ImageData {
  // Set the pixel at (x,y)
  public static poke(imageData: IImageData, x: number, y: number, pixel: number[]): void {
    if (pixel !== undefined) {
      const i: number = this.coordsToindex(imageData, x, y);
      if (i !== undefined) {
        imageData.data[i] = pixel[0];
        imageData.data[i + 1] = pixel[1];
        imageData.data[i + 2] = pixel[2];
        imageData.data[i + 3] = pixel[3];
      }
    }
  }

  // Get the pixel at (x,y)
  public static peek(imageData: IImageData, x: number, y: number): number[] {
    const i: number = this.coordsToindex(imageData, x, y);
    if (i !== undefined) {
      return [
        imageData.data[i],
        imageData.data[i + 1],
        imageData.data[i + 2],
        imageData.data[i + 3]
      ];
    }
    return Pixels.emptyPixel;
  }

  private static coordsToindex(imageData: IImageData, x: number, y: number): number {
    const result: number = Math.floor(y) * (imageData.width << 2) + (x << 2);
    return result < imageData.data.length ? result : undefined;
  }
}
