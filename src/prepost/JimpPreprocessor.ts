import * as Jimp from 'jimp';
import ImageData from '../model/ImageData';
import IImageData from '../model/ImageDataInterface';
import PixelImage from '../model/PixelImage';
import GraphicMode from '../profiles/GraphicMode';

export default class JimpPreprocessor {
  public static async justRead(filename: string): Promise<IImageData> {
    return (await Jimp.read(filename)).bitmap;
  }

  public static async read(filename: string, graphicMode: GraphicMode): Promise<IImageData> {
    const jimpImage: Jimp = await Jimp.read(filename);
    this.cropFill(jimpImage, graphicMode);
    return jimpImage.bitmap;
  }

  public static async justwrite(pixelImage: PixelImage, image: Jimp, filename: string): Promise<Jimp> {
    for (let y = 0; y < image.bitmap.height; y += 1) {
      for (let x = 0; x < image.bitmap.width; x += 1) {
        const pixelValue: number[] = x >= pixelImage.mode.fliBugSize ? pixelImage.peek(x, y) : [0, 0, 0, 0xff];
        ImageData.poke(image.bitmap, x, y, pixelValue);
      }
    }
    return image.write(filename);
  }

  public static async write(pixelImage: PixelImage, image: Jimp, filename: string): Promise<Jimp> {
    this.toJimpImage(pixelImage, image);
    this.resize(image, pixelImage.mode);
    return image.write(filename);
  }

  private static toJimpImage(pixelImage: PixelImage, result: Jimp): void {
    for (let y = 0; y < result.bitmap.height; y += 1) {
      for (let x = 0; x < result.bitmap.width; x += 1) {
        const pixelValue: number[] = x >= pixelImage.mode.fliBugSize ? pixelImage.peek(x, y) : [0, 0, 0, 0xff];
        ImageData.poke(result.bitmap, x, y, pixelValue);
      }
    }
  }

  private static resize(jimpImage: Jimp, graphicMode: GraphicMode): void {
    jimpImage.resize(graphicMode.width * graphicMode.pixelWidth, graphicMode.height * graphicMode.pixelHeight);
  }

  // Crop a JIMP Image to fill up a specific ratio. Ratio is passed as relative width and height.
  private static cropFill(jimpImage: Jimp, graphicMode: GraphicMode): void {
    const srcWidth: number = jimpImage.bitmap.width;
    const srcHeight: number = jimpImage.bitmap.height;
    const destratio: number =
      (graphicMode.width * graphicMode.pixelWidth) / (graphicMode.height * graphicMode.pixelHeight);
    const srcratio: number = srcWidth / srcHeight;
    const cropwidth: number = Math.round(srcratio > destratio ? srcHeight * destratio : srcWidth);
    const cropheight: number = Math.round(srcratio > destratio ? srcHeight : srcWidth / destratio);
    const sourceLeft: number = Math.round((srcWidth - cropwidth) / 2);
    const sourceTop: number = Math.round((srcHeight - cropheight) / 2);
    jimpImage.crop(sourceLeft, sourceTop, cropwidth, cropheight);
    jimpImage.resize(graphicMode.width, graphicMode.height);
  }
}
