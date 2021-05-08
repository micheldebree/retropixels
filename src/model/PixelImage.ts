import GraphicMode from '../profiles/GraphicMode';
import ColorMap from './ColorMap';

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
   * Get the palette index of a particular pixel
   * @param x X coordinate
   * @param y Y coordinate
   */
  public peek(x: number, y: number): number {
    const colorMapIndex = this.pixelIndex[y][x];
    if (colorMapIndex === undefined) {
      return undefined;
    }
    // get the palette index from the ColorMap
    return this.colorMaps[colorMapIndex].get(x, y);
  }

  public addColorMap(resXVal: number = this.mode.width, resYVal: number = this.mode.height): void {
    this.colorMaps.push(new ColorMap(this.mode.width, this.mode.height, resXVal, resYVal));
  }

  public mapPixelIndex(x: number, y: number): number {
    if (x >= this.mode.width || x < 0) {
      throw new Error(`x value out of bounds: ${x}`);
    }
    if (y >= this.mode.height || y < 0) {
      throw new Error(`y value out of bounds: ${y}`);
    }
    return this.mode.indexMap[this.pixelIndex[y][x]];
  }

  public extractAttributeData(yOffset: number, callback: (x: number, y: number) => number): Uint8Array {
    const result: Uint8Array = new Uint8Array(1000).fill(0);
    let index = 0;

    this.mode.forEachCell(yOffset, (x, y) => {
      result[index] = x >= this.mode.fliBugSize ? callback(x, y) : 0;
      index += 1;
    });
    return result;
  }

  public isHires(): boolean {
    return this.mode.pixelWidth === 1;
  }

  public debugColorMaps(): PixelImage[] {
    const result: PixelImage[] = [];

    this.colorMaps.forEach(colorMap => {
      const pixelImage = new PixelImage(this.mode);
      pixelImage.colorMaps.push(colorMap);
      for (let x = 0; x < this.mode.width; x += 1) {
        for (let y = 0; y < this.mode.height; y += 1) {
          pixelImage.pixelIndex[y][x] = 0;
        }
      }
      result.push(pixelImage);
    });
    return result;
  }
}
