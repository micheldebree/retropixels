import IImageData from '../model/IImageData'
import Palette from '../model/Palette'
import Pixels from '../model/Pixels'
import { ColorSpace } from '../profiles/ColorSpaces'

// https://www.easyrgb.com/en/math.php
// https://stackoverflow.com/questions/15408522/rgb-to-xyz-and-lab-colours-conversion
// https://stackoverflow.com/questions/6242114/how-much-worse-is-srgb-than-lab-when-computing-the-eucleidan-distance-between
// https://www.compuphase.com/cmetric.htm
// https://godsnotwheregodsnot.blogspot.com/2012/09/color-space-comparisons.html
// https://en.wikipedia.org/wiki/Color_difference
// https://bisqwit.iki.fi/jutut/colorquant/
// https://sistenix.com/rgb2ycbcr.html
// https://stackoverflow.com/questions/7086820/convert-rgb-to-ycbcr-c-code
// https://github.com/usolved/cie-rgb-converter/blob/master/cie_rgb_converter.js
// https://gist.github.com/manojpandey/f5ece715132c572c80421febebaf66ae
// https://ninedegreesbelow.com/photography/xyz-rgb.html
// https://bottosson.github.io/posts/oklab/
// https://stackoverflow.com/questions/9018016/how-to-compare-two-colors-for-similarity-difference
// http://www.colorwiki.com/wiki/Delta_E:_The_Color_Difference
// https://techkonusa.com/a-simple-review-of-cie-%CE%B4e-color-difference-equations/

/**
 * Maps a color to a palette.
 */
export default class Quantizer {
  private readonly colorspace: ColorSpace

  private readonly palette: Palette

  constructor (palette: Palette, colorspace: (pixel: number[]) => number[]) {
    this.colorspace = colorspace

    // convert palette to colorspace first
    this.palette = new Palette(palette.colors.map(p => colorspace(p)))
    this.palette.enabled = palette.enabled
  }

  public distance = (realPixel: number[], paletteIndex: number): number => {
    const realPixelConverted = this.colorspace(realPixel)
    const palettePixel = this.palette.colors[paletteIndex]

    return Math.sqrt(
      (realPixelConverted[0] - palettePixel[0]) ** 2 +
        (realPixelConverted[1] - palettePixel[1]) ** 2 +
        (realPixelConverted[2] - palettePixel[2]) ** 2
    )
  }

  /**
   * Get the best match for a pixel from a palette.
   * @param pixel The pixel color
   * @returns The index of the palette entry that contains the best match.
   */
  public quantizePixel (pixel: number[]): number {
    // map pixels to [index, distance to pixel],
    // then reduce to just the element with the lowest distance,
    // and return just the index.

    return this.palette.enabled
      .map(index => [index, this.distance(pixel, index)])
      .reduce((acc, current) => (current[1] < acc[1] ? current : acc), [0, Number.POSITIVE_INFINITY])[0]
  }

  // return a palette index for each pixel in the image
  public quantizeImage (image: IImageData): number[] {
    const result: number[] = []
    for (let y = 0; y < image.height; y++) {
      for (let x = 0; x < image.width; x++) {
        result.push(this.quantizePixel(Pixels.peek(image, x, y)))
      }
    }
    return result
  }
}
