import * as Jimp from 'jimp'
import { Palettes } from '../profiles/Palettes'
import ColorMap from '../model/ColorMap'
import { poke } from '../model/Pixels'

export async function exportColorMap (colorMap: ColorMap, filename: string): Promise<void> {
  return await new Promise((resolve, reject) => {
    new Jimp(colorMap.width, colorMap.height, (err, image) => {
      if (err != null) {
        reject()
      }
      colorMap.forEachCell((x, y) => {
        colorMap.forEachPixelInCell(x, y, (xx, yy) => {
          const index = colorMap.getNonEmpty(xx, yy)
          const pixel: number[] = Palettes.colodore.colors[index]
          poke(image.bitmap, xx, yy, pixel)
        })
      })

      image
        .writeAsync(filename)
        .then(() => resolve())
        .catch(() => reject())
    })
  })
}

export async function exportQuantizedImage (
  quantizedImage: number[],
  width: number,
  height: number,
  filename: string
): Promise<void> {
  return await new Promise((resolve, reject) => {
    new Jimp(width, height, (err, image) => {
      if (err != null) {
        reject()
      }
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < width; y++) {
          const index = quantizedImage[x + y * width]
          const pixel: number[] = Palettes.colodore.colors[index]
          poke(image.bitmap, x, y, pixel)
        }
      }
      image
        .writeAsync(filename)
        .then(() => resolve())
        .catch(() => reject())
    })
  })
}
