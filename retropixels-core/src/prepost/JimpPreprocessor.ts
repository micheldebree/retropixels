import * as Jimp from 'jimp'
import IImageData from '../model/IImageData'
import PixelImage from '../model/PixelImage'
import GraphicMode from '../model/GraphicMode'
import { poke, emptyPixel } from '../model/Pixels'
import Palette from '../model/Palette'

// https://github.com/oliver-moran/jimp

enum ScaleMode {
  none = 'none',
  fill = 'fill'
}
export async function read (filename: string, graphicMode: GraphicMode, scaleMode: ScaleMode): Promise<IImageData> {
  const jimpImage: Jimp = await Jimp.read(filename)
  if (scaleMode === ScaleMode.none) {
    crop(jimpImage, graphicMode)
  } else if (scaleMode === ScaleMode.fill) {
    cropFill(jimpImage, graphicMode)
  }
  return jimpImage.bitmap
}
export async function write (pixelImage: PixelImage, filename: string, palette: Palette): Promise<Jimp> {
  const image: Jimp = await toJimpImage(pixelImage, palette)
  image.resize(
    pixelImage.mode.width * pixelImage.mode.pixelWidth,
    pixelImage.mode.height * pixelImage.mode.pixelHeight,
    Jimp.RESIZE_NEAREST_NEIGHBOR
  )
  return image.write(filename)
}

async function toJimpImage (pixelImage: PixelImage, palette: Palette): Promise<Jimp> {
  return await new Promise((resolve, reject) => {
    new Jimp(pixelImage.mode.width, pixelImage.mode.height, (err, image) => {
      pokeToJimp(image, pixelImage, palette)
      if (err != null) reject(err)
      resolve(image)
    })
  })
}

function pokeToJimp (image: Jimp, pixelImage: PixelImage, palette: Palette): void {
  for (let y = 0; y < image.bitmap.height; y += 1) {
    for (let x = 0; x < image.bitmap.width; x += 1) {
      let pixelValue: number[]
      if (x < pixelImage.mode.fliBugSize) {
        pixelValue = [0, 0, 0, 0xff]
      } else {
        const paletteIndex = pixelImage.peek(x, y)
        pixelValue = paletteIndex !== undefined ? palette.colors[paletteIndex] : emptyPixel
      }

      poke(image.bitmap, x, y, pixelValue)
    }
  }
}

// crop to fill (--scale none)
// multicolor images are halved in width with nearest neighbor so there is no anti-aliasing
// this is for pixel perfect input images
function crop (jimpImage: Jimp, graphicMode: GraphicMode): void {
  if (jimpImage.bitmap.width < graphicMode.width || jimpImage.bitmap.height < graphicMode.height) {
    throw new Error(
        `Image size (${jimpImage.bitmap.width}x${jimpImage.bitmap.height}) must be at least ${
          graphicMode.width * graphicMode.pixelWidth
        }x${graphicMode.height * graphicMode.pixelHeight}`
    )
  }
  if (graphicMode.pixelWidth !== 1) {
    jimpImage.resize(
      jimpImage.bitmap.width / graphicMode.pixelWidth,
      jimpImage.bitmap.height,
      Jimp.RESIZE_NEAREST_NEIGHBOR
    )
  }
  jimpImage.crop(0, 0, graphicMode.width, graphicMode.height)
}

// resize to fill (--scale fill)
function cropFill (jimpImage: Jimp, graphicMode: GraphicMode): void {
  jimpImage.cover(graphicMode.width * graphicMode.pixelWidth, graphicMode.height * graphicMode.pixelHeight)
  jimpImage.resize(graphicMode.width, graphicMode.height)
}
