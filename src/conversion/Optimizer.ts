import ColorMap from '../model/ColorMap';
import IImageData from '../model/IImageData';
import PixelImage from '../model/PixelImage';
import Poker from './Poker';

export default class Optimizer {
  public poker: Poker;

  constructor(poker: Poker) {
    this.poker = poker;
  }

  public optimizeColorMaps(pixelImage: PixelImage, imageData: IImageData): void {
    const colorMap: ColorMap = this.getColorMap(imageData, pixelImage);
    // fill up the colormaps in the restricted image based on the colors in the unrestricted image
    pixelImage.colorMaps.forEach(map => {
      Optimizer.extractColorMap(colorMap, map);
    });
  }

  // TODO: now uses palette of first color map only
  private getColorMap(imageData: IImageData, targetPixelImage: PixelImage): ColorMap {
    const w: number = imageData.width;
    const h: number = imageData.height;
    const unrestrictedImage: PixelImage = new PixelImage(targetPixelImage.mode);
    const { palette } = targetPixelImage.colorMaps[0];
    unrestrictedImage.colorMaps.push(new ColorMap(w, h, palette, 1, 1));
    this.poker.drawImageData(imageData, unrestrictedImage);
    return unrestrictedImage.colorMaps[0];
  }

  private static reduceToMax(colors: number[]): number {
    const weights: number[] = [];
    let maxWeight: number;
    let maxColor: number;

    colors.forEach(c => {
      weights[c] = weights[c] === undefined ? 1 : weights[c] + 1;
      if (maxWeight === undefined || weights[c] > maxWeight) {
        maxWeight = weights[c];
        maxColor = c;
      }
    });
    return maxColor;
  }

  /**
   * Delete colors from one colorMap and put them in another.
   */
  private static extractColorMap(fromColorMap: ColorMap, toColorMap: ColorMap): void {
    toColorMap.forEachCell((x, y) => {
      const colors: number[] = [];
      toColorMap.forEachPixel(x, y, (xx, yy) => {
        const colorIndex: number = fromColorMap.get(xx, yy);
        if (colorIndex !== undefined) {
          colors.push(colorIndex);
        }
      });
      toColorMap.put(x, y, Optimizer.reduceToMax(colors));
    });
    fromColorMap.subtract(toColorMap);
  }
}
