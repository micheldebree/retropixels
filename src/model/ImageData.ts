import { ImageDataInterface } from './ImageDataInterface';
import { PixelImage } from './PixelImage';

export class ImageData {
  // Set the pixel at (x,y)
  public static poke(imageData: ImageDataInterface, x: number, y: number, pixel: number[]): void {
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
  public static peek(imageData: ImageDataInterface, x: number, y: number): number[] {
    const i: number = this.coordsToindex(imageData, x, y);
    if (i !== undefined) {
      return [imageData.data[i], imageData.data[i + 1], imageData.data[i + 2], imageData.data[i + 3]];
    }
    return [0, 0, 0, 0]; // TODO: is emptyPixel defined?
  }

  // Draw ImageData onto a PixelImage
  public static drawImageData(imageData: ImageDataInterface, pixelImage: PixelImage) {
    for (let y: number = 0; y < pixelImage.height; y += 1) {
      for (let x: number = 0; x < pixelImage.width; x += 1) {
        const pixel: number[] = this.peek(imageData, x, y);
        pixelImage.poke(x, y, pixel);
      }
    }
  }

  private static coordsToindex(imageData: ImageDataInterface, x: number, y: number): number {
    const result: number = Math.floor(y) * (imageData.width << 2) + (x << 2);
    return result < imageData.data.length ? result : undefined;
  }
}
