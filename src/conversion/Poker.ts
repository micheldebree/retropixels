import { Palette } from '../model/Palette';
import { PixelImage } from '../model/PixelImage';
import { Quantizer } from './Quantizer';
export class Poker {
 /**
  * Map a 'real' color to the best match in the image.
  * @param {number} x - x coordinate
  * @param {number} y - y coordinate
  * @param {Array} pixel - Pixel values [r, g, b]
  */
  public static poke(image: PixelImage, x: number, y: number, realColor: number[]): void {
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

  /**
   * Get the color of a particular pixel.
   * @param {int} x X coordinate
   * @param {int} y Y coordinate
   * @returns {Array} Pixel values [r, g, b, a], or an empty pixel if x and y are out of range.
   */
  public static peek(image: PixelImage, x: number, y: number): number[] {
    // get the ColorMap for the color
    const colorMapIndex = image.pixelIndex[y][x];
    if (colorMapIndex === undefined) {
      return undefined;
    }

    // get the palette index from the ColorMap
    const colorMap = image.colorMaps[colorMapIndex];
    const paletteIndex = colorMap.get(x, y);

    // return the color from the palette
    return paletteIndex !== undefined ? colorMap.palette.get(paletteIndex) : [0, 0, 0, 0];
  }

  /*
     Find a ColorMap that the color can be mapped on exactly.
     Do this by mapping the color to each ColorMaps's palette and checking if the
     ColorMap has that mapped color at the specified position.
     Returns the index of the ColorMap
  */
  private static findColorInMap(image: PixelImage, x: number, y: number, realColor: number[]): number {
    let i: number = 0;

    for (const colorMap of image.colorMaps) {
      const mappedIndex: number = Quantizer.mapPixel(x, y, realColor, colorMap.palette);
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
  private static tryClaimUnusedInMap(image: PixelImage, x: number, y: number, realColor: number[]): number {
    let i: number = 0;

    for (const colorMap of image.colorMaps) {
      if (colorMap.get(x, y) === undefined) {
        const color = Quantizer.mapPixel(x, y, realColor, colorMap.palette);
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
  private static map(image: PixelImage, x: number, y: number, pixel: number[]): number {
    // determine closest pixel in palette (ignoring alpha)
    const palette = new Palette([]);
    for (const colorMap of image.colorMaps) {
      palette.pixels.push(colorMap.getColor(x, y));
    }
    return Quantizer.mapPixel(x, y, pixel, palette);
  }
}
