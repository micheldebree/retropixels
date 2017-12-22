import * as Jimp from 'jimp';
import { ImageData } from '../model/ImageData';
import { ImageDataInterface } from '../model/ImageDataInterface';

import { Poker } from '../conversion/Poker';
import { PixelImage } from '../model/PixelImage';
import { GraphicMode } from '../profiles/GraphicMode';

export class JimpPreprocessor {
  public static async justRead(filename: string): Promise<ImageDataInterface> {
    return (await Jimp.read(filename)).bitmap;
  }

  public static async read(filename: string, graphicMode: GraphicMode): Promise<ImageDataInterface> {
    const jimpImage: Jimp = await Jimp.read(filename);
    this.cropFill(jimpImage, graphicMode);
    return jimpImage.bitmap;
  }

  public static async justwrite(pixelImage: PixelImage, image: Jimp, filename: string): Promise<Jimp> {
    for (let y: number = 0; y < image.bitmap.height; y += 1) {
      for (let x: number = 0; x < image.bitmap.width; x += 1) {
        const pixelValue: number[] = x >= pixelImage.mode.FLIBugSize ? Poker.peek(pixelImage, x, y) : [0, 0, 0, 0xff];
        ImageData.poke(image.bitmap, x, y, pixelValue);
      }
    }
    return await image.write(filename);
  }

  public static async write(pixelImage: PixelImage, image: Jimp, filename: string): Promise<Jimp> {
    for (let y: number = 0; y < image.bitmap.height; y += 1) {
      for (let x: number = 0; x < image.bitmap.width; x += 1) {
        const pixelValue: number[] = x >= pixelImage.mode.FLIBugSize ? Poker.peek(pixelImage, x, y) : [0, 0, 0, 0xff];
        ImageData.poke(image.bitmap, x, y, pixelValue);
      }
    }
    image.resize(
      pixelImage.mode.width * pixelImage.mode.pixelWidth,
      pixelImage.mode.height * pixelImage.mode.pixelHeight
    );
    return await image.write(filename);
  }

  // Crop a JIMP Image to fill up a specific ratio. Ratio is passed as relative width and height.
  private static cropFill(jimpImage: Jimp, graphicMode: GraphicMode): void {
    const srcWidth: number = jimpImage.bitmap.width;
    const srcHeight: number = jimpImage.bitmap.height;
    const destratio: number =
      graphicMode.width * graphicMode.pixelWidth / (graphicMode.height * graphicMode.pixelHeight);
    const srcratio: number = srcWidth / srcHeight;
    const cropwidth: number = Math.round(srcratio > destratio ? srcHeight * destratio : srcWidth);
    const cropheight: number = Math.round(srcratio > destratio ? srcHeight : srcWidth / destratio);
    const sourceLeft: number = Math.round((srcWidth - cropwidth) / 2);
    const sourceTop: number = Math.round((srcHeight - cropheight) / 2);
    jimpImage.crop(sourceLeft, sourceTop, cropwidth, cropheight);
    jimpImage.resize(graphicMode.width, graphicMode.height);
  }
}
