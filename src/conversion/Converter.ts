import { ImageData } from '../model/ImageData';
import { ImageDataInterface } from '../model/ImageDataInterface';
import { PixelImage } from '../model/PixelImage';
import { GraphicMode } from '../profiles/GraphicMode';
import { Optimizer } from './Optimizer';
import { Poker } from './Poker';

export class Converter {
  public static convert(imageData: ImageDataInterface, graphicMode: GraphicMode): PixelImage {
    const pixelImage: PixelImage = graphicMode.factory();

    Optimizer.optimizeColorMaps(pixelImage, imageData);
    this.drawImageData(pixelImage, imageData);
    return pixelImage;
  }

  /**
   * Map ImageData on the PixelImage
   * @param {PixelImage} image The PixelImage to map image data to.
   * @param  {ImageDataInterface} imageData The ImageData to map
   */
  private static drawImageData(image: PixelImage, imageData: ImageDataInterface): void {
    for (let y: number = 0; y < image.mode.height; y += 1) {
      for (let x: number = 0; x < image.mode.width; x += 1) {
        Poker.poke(image, x, y, ImageData.peek(imageData, x, y));
      }
    }
  }
}
