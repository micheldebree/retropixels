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

  private static reduceToMax(colorMap: ColorMap, x: number, y: number, w: number, h: number): number {
    const weights: number[] = [];
    let maxWeight: number;
    let maxColor: number;

    for (let ix: number = x; ix < x + w; ix += 1) {
      for (let iy: number = y; iy < y + h; iy += 1) {
        const colorIndex: number = colorMap.get(ix, iy);
        if (colorIndex !== undefined) {
          weights[colorIndex] = weights[colorIndex] === undefined ? 1 : weights[colorIndex] + 1;
          if (maxWeight === undefined || weights[colorIndex] > maxWeight) {
            maxWeight = weights[colorIndex];
            maxColor = colorIndex;
          }
        }
      }
    }
    return maxColor;
  }

  /**
   * Delete colors from one colorMap and put them in another.
   */
  private static extractColorMap(fromColorMap: ColorMap, toColorMap: ColorMap): void {
    const rx: number = toColorMap.resX;
    const ry: number = toColorMap.resY;

    for (let x = 0; x < toColorMap.width; x += rx) {
      for (let y = 0; y < toColorMap.height; y += ry) {
        toColorMap.put(x, y, Optimizer.reduceToMax(fromColorMap, x, y, rx, ry));
      }
    }
    fromColorMap.subtract(toColorMap);
  }
}
