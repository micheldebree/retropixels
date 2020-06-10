import IImageData from '../model/IImageData';
import PixelImage from '../model/PixelImage';
import Optimizer from './Optimizer';
import Poker from './Poker';
import Pixels from '../model/Pixels';

// TODO: this doesn't really do much..
// Maybe make this part of the cli
export default class Converter {
  private readonly poker: Poker;

  private optimizer: Optimizer;

  constructor(poker: Poker) {
    this.poker = poker;
    this.optimizer = new Optimizer(this.poker);
  }

  public convert(imageData: IImageData, pixelImage: PixelImage): void {
    console.time('Converter::convert');
    this.optimizer.optimizeColorMaps(pixelImage, imageData);
    this.drawImageData(pixelImage, imageData);
    console.timeEnd('Converter::convert');
  }

  /**
   * Map ImageData on the PixelImage
   * @param {PixelImage} image The PixelImage to map image data to.
   * @param {IImageData} imageData The ImageData to map
   */
  private drawImageData(image: PixelImage, imageData: IImageData): void {
    for (let y = 0; y < image.mode.height; y += 1) {
      for (let x = 0; x < image.mode.width; x += 1) {
        this.poker.poke(image, x, y, Pixels.peek(imageData, x, y));
      }
    }
  }
}
