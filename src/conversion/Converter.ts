import ImageData from '../model/ImageData';
import IImageData from '../model/ImageDataInterface';
import PixelImage from '../model/PixelImage';
import GraphicMode from '../profiles/GraphicMode';
import Optimizer from './Optimizer';
import Poker from './Poker';

export default class Converter {
  public poker: Poker;

  public optimizer: Optimizer;

  constructor() {
    this.poker = new Poker();
    this.optimizer = new Optimizer(this.poker);
  }

  public convert(imageData: IImageData, graphicMode: GraphicMode): PixelImage {
    const pixelImage: PixelImage = graphicMode.factory();

    this.optimizer.optimizeColorMaps(pixelImage, imageData);
    this.drawImageData(pixelImage, imageData);
    return pixelImage;
  }

  /**
   * Map ImageData on the PixelImage
   * @param {PixelImage} image The PixelImage to map image data to.
   * @param  {IImageData} imageData The ImageData to map
   */
  private drawImageData(image: PixelImage, imageData: IImageData): void {
    for (let y = 0; y < image.mode.height; y += 1) {
      for (let x = 0; x < image.mode.width; x += 1) {
        this.poker.poke(image, x, y, ImageData.peek(imageData, x, y));
      }
    }
  }
}
