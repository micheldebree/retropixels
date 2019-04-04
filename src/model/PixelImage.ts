import { GraphicMode } from '../profiles/GraphicMode';
import { ColorMap } from './ColorMap';

export class PixelImage {
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

  public addColorMap(resXVal: number = this.mode.width, resYVal: number = this.mode.height): void {
    this.colorMaps.push(
      new ColorMap(this.mode.width, this.mode.height, this.mode.palette, resXVal, resYVal)
    );
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
