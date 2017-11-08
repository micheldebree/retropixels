import { Quantizer } from '../conversion/Quantizer';
import { GraphicMode } from '../profiles/GraphicMode';
import { ColorMap } from './ColorMap';
import { Palette } from './Palette';

export class PixelImage {
  public colorMaps: ColorMap[];
  public mode: GraphicMode;

  public quantizer: Quantizer = new Quantizer();

  public pixelIndex: number[][];

  constructor(mode: GraphicMode) {
    // public properties
    this.mode = mode;
    this.colorMaps = []; // maps x,y to a color
    this.pixelIndex = []; // maps pixel x,y to a colormap
    for (let y = 0; y < mode.height; y++) {
      this.pixelIndex[y] = [];
    }
  }

  /*
     Find a ColorMap that the color can be mapped on exactly.
     Do this by mapping the color to each ColorMaps's palette and checking if the
     ColorMap has that mapped color at the specified position.
     Returns the index of the ColorMap
  */
  public findColorInMap(x: number, y: number, realColor: number[]): number {
    let i: number = 0;

    for (const colorMap of this.colorMaps) {
      const mappedIndex: number = this.quantizer.mapPixel(x, y, realColor, colorMap.palette);
      if (mappedIndex === colorMap.get(x, y)) {
        return i;
      }
      i++;
    }
    return undefined;
  }

  /*
    Try all ColorMaps to find an area that is not defined yet.
    If found, map realColor to the ColorMap's palette and claim the area.
    Returns index into the found ColorMap.
  */
  public tryClaimUnusedInMap(x: number, y: number, realColor: number[]): number {
    let i: number = 0;

    for (const colorMap of this.colorMaps) {
      if (colorMap.get(x, y) === undefined) {
        const color = this.quantizer.mapPixel(x, y, realColor, colorMap.palette);
        colorMap.put(x, y, color);
        return i;
      }
      i++;
    }
    return undefined;
  }

  /**
   * Map a pixel to the closest available Colormap.
   * @param {int} x X coordinate
   * @param {int} y Y coordinate
   * @returns {int} Colormap index for the closest Colormap
   */
  public map(pixel: number[], x: number, y: number): number {
    // determine closest pixel in palette (ignoring alpha)
    const palette = new Palette([]);
    for (const colorMap of this.colorMaps) {
      palette.pixels.push(colorMap.getColor(x, y));
    }
    return this.quantizer.mapPixel(x, y, pixel, palette);
  }

  /**
   * Map a 'real' color to the best match in the image.
   * @param {number} x - x coordinate
   * @param {number} y - y coordinate
   * @param {Array} pixel - Pixel values [r, g, b]
   */
  public poke(x: number, y: number, realColor: number[]): void {
    // idea: do 'smart' poking in a separate class, with dependency to dithering

    // try to reuse existing color map that has an exact fit for this color
    let colorMapIndex: number = this.findColorInMap(x, y, realColor);
    if (colorMapIndex !== undefined) {
      this.pixelIndex[y][x] = colorMapIndex;
      return;
    }

    // else see if there is a map with an empty attribute that we can claim
    colorMapIndex = this.tryClaimUnusedInMap(x, y, realColor);
    if (colorMapIndex !== undefined) {
      this.pixelIndex[y][x] = colorMapIndex;
      return;
    }

    // otherwise just map to the ColorMap that has the closest match at x,y
    colorMapIndex = this.map(realColor, x, y);
    this.pixelIndex[y][x] = colorMapIndex;
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
    return paletteIndex !== undefined ? colorMap.palette.get(paletteIndex) : [0, 0, 0, 0];
  }

  public addColorMap(colorMap: ColorMap): void {
    this.colorMaps.push(colorMap);
  }

  public debugColorMaps(): PixelImage[] {
    const result: PixelImage[] = [];

    for (const colorMap of this.colorMaps) {
      const pixelImage = new PixelImage(this.mode);
      pixelImage.colorMaps.push(colorMap);
      for (let x = 0; x < this.mode.width; x++) {
        for (let y = 0; y < this.mode.height; y++) {
          pixelImage.pixelIndex[y][x] = 0;
        }
      }
      result.push(pixelImage);
    }
    return result;
  }
}
