import * as Jimp from 'jimp';
import IImageData from '../model/IImageData';
import PixelImage from '../model/PixelImage';
import GraphicMode from '../profiles/GraphicMode';
import Pixels from '../model/Pixels';

// https://github.com/oliver-moran/jimp

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
    this.pokeToJimp(image, pixelImage);
    return image.write(filename);
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

  // Crop a JIMP Image to fill up a specific ratio. Ratio is passed as relative width and height.
  private static cropFill(jimpImage: Jimp, graphicMode: GraphicMode): void {
    const srcWidth: number = jimpImage.bitmap.width;
    const srcHeight: number = jimpImage.bitmap.height;
    const destRatio: number =
      (graphicMode.width * graphicMode.pixelWidth) / (graphicMode.height * graphicMode.pixelHeight);
    const srcRatio: number = srcWidth / srcHeight;
    const cropWidth: number = Math.round(srcRatio > destRatio ? srcHeight * destRatio : srcWidth);
    const cropHeight: number = Math.round(srcRatio > destRatio ? srcHeight : srcWidth / destRatio);
    const sourceLeft: number = Math.round((srcWidth - cropWidth) / 2);
    const sourceTop: number = Math.round((srcHeight - cropHeight) / 2);
    jimpImage.crop(sourceLeft, sourceTop, cropWidth, cropHeight);
    jimpImage.resize(graphicMode.width, graphicMode.height);
  }
}
