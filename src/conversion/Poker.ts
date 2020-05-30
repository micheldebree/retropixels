import Palette from '../model/Palette';
import PixelImage from '../model/PixelImage';
import Quantizer from './Quantizer';
import IImageData from '../model/IImageData';
import Pixels from '../model/Pixels';

export default class Poker {
  public quantizer: Quantizer = new Quantizer();

  /**
   * Map a 'real' color to the best match in the image.
   * @param {PixelImage} image The image to poke to
   * @param {number} x - x coordinate
   * @param {number} y - y coordinate
   * @param {number[]} realColor The color to poke into the image
   */
  public poke(image: PixelImage, x: number, y: number, realColor: number[]): void {
    // idea: do 'smart' poking in a separate class, with dependency to dithering

    // try to reuse existing color map that has an exact fit for this color
    let colorMapIndex: number = this.findColorInMap(image, x, y, realColor);
    if (colorMapIndex !== undefined) {
      image.pixelIndex[y][x] = colorMapIndex;
      return;
    }

    // else see if there is a map with an empty attribute that we can claim
    colorMapIndex = this.tryClaimUnusedInMap(image, x, y, realColor);
    if (colorMapIndex !== undefined) {
      image.pixelIndex[y][x] = colorMapIndex;
      return;
    }

    // otherwise just map to the ColorMap that has the closest match at x,y
    colorMapIndex = this.map(image, x, y, realColor);
    image.pixelIndex[y][x] = colorMapIndex;
  }

  // Draw ImageData onto a PixelImage
  public drawImageData(imageData: IImageData, pixelImage: PixelImage): void {
    for (let y = 0; y < pixelImage.mode.height; y += 1) {
      for (let x = 0; x < pixelImage.mode.width; x += 1) {
        const pixel: number[] = Pixels.peek(imageData, x, y);
        this.poke(pixelImage, x, y, pixel);
      }
    }
  }

  /*
     Find a ColorMap that the color can be mapped on exactly.
     Do this by mapping the color to each ColorMaps's palette and checking if the
     ColorMap has that mapped color at the specified position.
     Returns the index of the ColorMap
  */
  private findColorInMap(image: PixelImage, x: number, y: number, realColor: number[]): number {
    let i = 0;

    for (const colorMap of image.colorMaps) {
      const mappedIndex: number = this.quantizer.mapPixel(x, y, realColor, colorMap.palette);
      if (mappedIndex === colorMap.get(x, y)) {
        return i;
      }
      i += 1;
    }
    return undefined;
  }

  /*
    Try all ColorMaps to find an area that is not defined yet.
    If found, map realColor to the ColorMap's palette and claim the area.
    Returns index into the found ColorMap.
  */
  private tryClaimUnusedInMap(image: PixelImage, x: number, y: number, realColor: number[]): number {
    let i = 0;

    for (const colorMap of image.colorMaps) {
      if (colorMap.get(x, y) === undefined) {
        const color = this.quantizer.mapPixel(x, y, realColor, colorMap.palette);
        colorMap.put(x, y, color);
        return i;
      }
      i += 1;
    }
    return undefined;
  }

  private map(image: PixelImage, x: number, y: number, pixel: number[]): number {
    // determine closest pixel in palette (ignoring alpha)
    const palette = new Palette([]);
    for (const colorMap of image.colorMaps) {
      palette.pixels.push(colorMap.getColor(x, y));
    }
    return this.quantizer.mapPixel(x, y, pixel, palette);
  }
}
