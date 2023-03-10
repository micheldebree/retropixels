import * as Jimp from 'jimp'
import IImageData from '../model/IImageData'
import PixelImage from '../model/PixelImage'
import GraphicMode from '../model/GraphicMode'
import Pixels from '../model/Pixels'
import Palette from '../model/Palette'

// https://github.com/oliver-moran/jimp

enum ScaleMode {
  none = 'none',
  fill = 'fill'
}

export default class JimpPreprocessor {
  public static async read (filename: string, graphicMode: GraphicMode, scaleMode: ScaleMode): Promise<IImageData> {
    const jimpImage: Jimp = await Jimp.read(filename)
    if (scaleMode === ScaleMode.none) {
      this.crop(jimpImage, graphicMode)
    } else if (scaleMode === ScaleMode.fill) {
      this.cropFill(jimpImage, graphicMode)
    } else {
      throw new Error(`Unknown scale mode: ${scaleMode}`)
    }
    return jimpImage.bitmap
  }

  public static async write (pixelImage: PixelImage, filename: string, palette: Palette): Promise<Jimp> {
    const image: Jimp = await this.toJimpImage(pixelImage, palette)
    image.resize(
      pixelImage.mode.width * pixelImage.mode.pixelWidth,
      pixelImage.mode.height * pixelImage.mode.pixelHeight,
      Jimp.RESIZE_NEAREST_NEIGHBOR
    )
    return image.write(filename)
  }

  private static async toJimpImage (pixelImage: PixelImage, palette: Palette): Promise<Jimp> {
    return await new Promise((resolve, reject) => {
      new Jimp(pixelImage.mode.width, pixelImage.mode.height, (err, image) => {
        this.pokeToJimp(image, pixelImage, palette)
        if (err) reject(err)
        resolve(image)
      })
    })
  }

  private static pokeToJimp (image: Jimp, pixelImage: PixelImage, palette: Palette): void {
    for (let y = 0; y < image.bitmap.height; y += 1) {
      for (let x = 0; x < image.bitmap.width; x += 1) {
        let pixelValue:number[]
        if (x < pixelImage.mode.fliBugSize) {
          pixelValue = [0, 0, 0, 0xff]
        } else {
          const paletteIndex = pixelImage.peek(x, y)
          pixelValue = paletteIndex !== undefined ? palette.colors[paletteIndex] : Pixels.emptyPixel
        }

        Pixels.poke(image.bitmap, x, y, pixelValue)
      }
    }
  }

  // crop to fill (--scale none)
  // multicolor images are halved in width with nearest neighbor so there is no anti-aliasing
  // this is for pixel perfect input images
  private static crop (jimpImage: Jimp, graphicMode: GraphicMode): void {
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
  private static cropFill (jimpImage: Jimp, graphicMode: GraphicMode): void {
    jimpImage.cover(graphicMode.width * graphicMode.pixelWidth, graphicMode.height * graphicMode.pixelHeight)
    jimpImage.resize(graphicMode.width, graphicMode.height)
  }
}
