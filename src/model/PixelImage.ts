import GraphicMode from '../profiles/GraphicMode';
import ColorMap from './ColorMap';
import Pixels from './Pixels';

export default class PixelImage {
  public colorMaps: ColorMap[];

  public mode: GraphicMode;

  public pixelIndex: number[][];

  constructor(mode: GraphicMode) {
    // public properties
    this.mode = mode;
    this.colorMaps = []; // maps x,y to a color
    this.pixelIndex = []; // maps pixel x,y to a ColorMap
    for (let y = 0; y < mode.height; y += 1) {
      this.pixelIndex[y] = [];
    }
  }

  /**
   * Get the color of a particular pixel.
   * @param {int} x X coordinate
   * @param {int} y Y coordinate
   * @returns {Array} Pixel values [r, g, b, a], or an empty pixel if x and y are out of range.
   */
  public peek(x: number, y: number): number[] {
    // get the ColorMap for the color
    const colorMapIndex = this.pixelIndex[y][x];
    if (colorMapIndex === undefined) {
      return undefined;
    }

    // get the palette index from the ColorMap
    const colorMap = this.colorMaps[colorMapIndex];
    const paletteIndex = colorMap.get(x, y);

    // return the color from the palette
    return paletteIndex !== undefined ? colorMap.palette.get(paletteIndex) : Pixels.emptyPixel;
  }

  public addColorMap(resXVal: number = this.mode.width, resYVal: number = this.mode.height): void {
    this.colorMaps.push(new ColorMap(this.mode.width, this.mode.height, this.mode.palette, resXVal, resYVal));
  }

  public debugColorMaps(): PixelImage[] {
    const result: PixelImage[] = [];

    for (const colorMap of this.colorMaps) {
      const pixelImage = new PixelImage(this.mode);
      pixelImage.colorMaps.push(colorMap);
      for (let x = 0; x < this.mode.width; x += 1) {
        for (let y = 0; y < this.mode.height; y += 1) {
          pixelImage.pixelIndex[y][x] = 0;
        }
      }
      result.push(pixelImage);
    }
    return result;
  }
}
