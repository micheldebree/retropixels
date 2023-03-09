import IImageData from '../model/IImageData'
import PixelImage from '../model/PixelImage'
import Pixels from '../model/Pixels'
import ColorMap from '../model/ColorMap'
import Quantizer from './Quantizer'

export default class Converter {
  private readonly quantizer: Quantizer

  constructor (quantizer: Quantizer) {
    this.quantizer = quantizer
  }

  public convert (imageData: IImageData, pixelImage: PixelImage): void {
    const unrestrictedImage: number[] = this.quantizer.quantizeImage(imageData)

    // Debugger.exportQuantizedImage(unrestrictedImage, imageData.width, imageData.height, 'quantizedImage.png');

    // fill up the color maps in the restricted image based on the colors in the unrestricted image
    pixelImage.colorMaps.forEach((map, index) => {
      // Debugger.exportColorMap(map, `debug.colorMap.${index}.png`)
      //   .then(() => console.log('Debug color map written.'))
      //   .catch(() => console.log('Could not write color map'));

      Converter.extractColorMap(unrestrictedImage, map, index, pixelImage)
    })
    // map the remaining pixels to existing colorMaps
    for (let y = 0; y < pixelImage.mode.height; y += 1) {
      for (let x = 0; x < pixelImage.mode.width; x += 1) {
        if (pixelImage.pixelIndex[y][x] === undefined) {
          this.mapToExistingColorMap(pixelImage, x, y, Pixels.peek(imageData, x, y))
        }
      }
    }
  }

  private mapToExistingColorMap (image: PixelImage, x: number, y: number, realColor: number[]): void {
    /* eslint-disable no-param-reassign */

    // get the color map that has the closest color at x,y to realColor
    let closestMap = 0
    let minDistance
    for (let i = 0; i < image.colorMaps.length; i++) {
      const paletteIndex = image.colorMaps[i].get(x, y)

      if (paletteIndex !== undefined) {
        const distance = this.quantizer.distance(realColor, paletteIndex)

        if (minDistance === undefined || distance < minDistance) {
          minDistance = distance
          closestMap = i
        }
      }
    }
    image.pixelIndex[y][x] = closestMap
  }

  private static reduceToMax (colors: number[]): number {
    const weights: number[] = []
    let maxWeight: number
    let maxColor: number

    colors.forEach(c => {
      weights[c] = weights[c] === undefined ? 1 : weights[c] + 1
      if (maxWeight === undefined || weights[c] > maxWeight) {
        maxWeight = weights[c]
        maxColor = c
      }
    })
    return maxColor
  }

  private static extractColorMap (
    quantizedImage: number[],
    toColorMap: ColorMap,
    colorMapIndex: number,
    pixelImage: PixelImage
  ) {
    const imageWidth = pixelImage.mode.width
    // for each cell:
    // - put the winning color from the quantized image in the color map cell
    // - for each winning color in the cell, set the index of the colorMap
    //   for that pixel in the PixelIMage
    toColorMap.forEachCell((x, y) => {
      const colorIndices: number[] = []
      if (toColorMap.get(x, y) === undefined) {
        toColorMap.forEachPixelInCell(x, y, (xx, yy) => {
          // this pixel has not been mapped
          if (quantizedImage[xx + yy * imageWidth] !== undefined) {
            colorIndices.push(quantizedImage[xx + yy * imageWidth])
          }
        })
        // best color wins and is put in the color map
        if (colorIndices.length > 0) {
          const winner: number = this.reduceToMax(colorIndices)
          toColorMap.put(x, y, winner)
          // all the pixels in the quantizedImage with that color are ticked off in the pixelImage
          toColorMap.forEachPixelInCell(x, y, (xx, yy) => {
            if (quantizedImage[xx + yy * imageWidth] === winner) {
              quantizedImage[xx + yy * imageWidth] = undefined
              pixelImage.pixelIndex[yy][xx] = colorMapIndex
            }
          })
        }
      }
    })
  }
}
