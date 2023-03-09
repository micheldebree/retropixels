import * as Jimp from 'jimp'
import { Palettes } from '..'
import ColorMap from '../model/ColorMap'
import Pixels from '../model/Pixels'

export default class Debugger {
  public static async exportColorMap (colorMap: ColorMap, filename: string): Promise<void> {
    return await new Promise((resolve, reject) => {
      new Jimp(colorMap.width, colorMap.height, (err, image) => {
        if (err) {
          reject()
        }
        colorMap.forEachCell((x, y) => {
          colorMap.forEachPixelInCell(x, y, (xx, yy) => {
            const index = colorMap.get(xx, yy)
            const pixel: number[] = Palettes.colodore.colors[index]
            Pixels.poke(image.bitmap, xx, yy, pixel)
          })
        })

        image
          .writeAsync(filename)
          .then(() => resolve())
          .catch(() => reject())
      })
    })
  }

  public static async exportQuantizedImage (
    quantizedImage: number[],
    width: number,
    height: number,
    filename: string
  ): Promise<void> {
    return await new Promise((resolve, reject) => {
      new Jimp(width, height, (err, image) => {
        if (err) {
          reject()
        }
        for (let x = 0; x < width; x++) {
          for (let y = 0; y < width; y++) {
            const index = quantizedImage[x + y * width]
            const pixel: number[] = Palettes.colodore.colors[index]
            Pixels.poke(image.bitmap, x, y, pixel)
          }
        }
        image
          .writeAsync(filename)
          .then(() => resolve())
          .catch(() => reject())
      })
    })
  }
}
