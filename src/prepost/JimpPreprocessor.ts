import * as Jimp from 'jimp';
import IImageData from '../model/IImageData';
import PixelImage from '../model/PixelImage';
import GraphicMode from '../profiles/GraphicMode';
import Pixels from '../model/Pixels';

// https://github.com/oliver-moran/jimp

enum ScaleMode {
  none = 'none',
  fill = 'fill'
}

export default class JimpPreprocessor {
  public static async read(filename: string, graphicMode: GraphicMode, scaleMode: ScaleMode): Promise<IImageData> {
    const jimpImage: Jimp = await Jimp.read(filename);
    if (scaleMode === ScaleMode.none) {
      this.crop(jimpImage, graphicMode);
    } else if (scaleMode === ScaleMode.fill) {
      this.cropFill(jimpImage, graphicMode);
    } else {
      throw new Error(`Unknown scale mode: ${scaleMode}`);
    }
    return jimpImage.bitmap;
  }

  public static async write(pixelImage: PixelImage, filename: string): Promise<Jimp> {
    const image: Jimp = await this.toJimpImage(pixelImage);
    this.resize(image, pixelImage.mode);
    return image.write(filename);
  }

  private static toJimpImage(pixelImage: PixelImage): Promise<Jimp> {
    return new Promise((resolve, reject) => {
      new Jimp(pixelImage.mode.width, pixelImage.mode.height, (err, image) => {
        this.pokeToJimp(image, pixelImage);
        if (err) reject(err);
        resolve(image);
      });
    });
  }

  private static pokeToJimp(image: Jimp, pixelImage: PixelImage): void {
    for (let y = 0; y < image.bitmap.height; y += 1) {
      for (let x = 0; x < image.bitmap.width; x += 1) {
        const pixelValue: number[] = x >= pixelImage.mode.fliBugSize ? pixelImage.peek(x, y) : [0, 0, 0, 0xff];
        Pixels.poke(image.bitmap, x, y, pixelValue);
      }
    }
  }

  private static resize(jimpImage: Jimp, graphicMode: GraphicMode): void {
    jimpImage.resize(graphicMode.width * graphicMode.pixelWidth, graphicMode.height * graphicMode.pixelHeight);
  }

  private static crop(jimpImage: Jimp, graphicMode: GraphicMode): void {
    if (graphicMode.pixelWidth !== 1) {
      jimpImage.resize(
        jimpImage.bitmap.width / graphicMode.pixelWidth,
        jimpImage.bitmap.height,
        Jimp.RESIZE_NEAREST_NEIGHBOR
      );
    }
    jimpImage.crop(0, 0, graphicMode.width, graphicMode.height);
  }

  private static cropFill(jimpImage: Jimp, graphicMode: GraphicMode): void {
    jimpImage.cover(graphicMode.width * graphicMode.pixelWidth, graphicMode.height * graphicMode.pixelHeight);
    jimpImage.resize(graphicMode.width, graphicMode.height);
  }
}
