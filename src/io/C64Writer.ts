import * as fs from 'fs-extra';
import * as path from 'path';
import AFLIPicture from './AFLIPicture';
import FLIPicture from './FLIPicture';
import ArtStudioPicture from './ArtStudioPicture';
import KoalaPicture from './KoalaPicture';
import SpritePad from './SpritePad';
import PixelImage from '../model/PixelImage';
import C64Layout from './C64Layout';
import IBinaryFormat from './IBinaryFormat';

export default class C64Writer {
  // Save PixelImage as a c64 native .PRG executable.
  public static async savePrg(pixelImage: PixelImage, outFile: string): Promise<void> {
    const picture: IBinaryFormat = C64Writer.getFormat(pixelImage);
    picture.fromPixelImage(pixelImage);
    return C64Writer.saveExecutable(picture, outFile);
  }

  private static viewersFolder = '/target/c64/';

  public static getFormat(pixelImage: PixelImage): IBinaryFormat {
    if (pixelImage.mode.id === 'bitmap') {
      if (pixelImage.isHires()) {
        return new ArtStudioPicture();
      }
      return new KoalaPicture();
    }

    if (pixelImage.mode.id === 'fli') {
      if (pixelImage.isHires()) {
        return new AFLIPicture();
      }
      return new FLIPicture();
    }

    if (pixelImage.mode.id === 'sprites') {
      return new SpritePad();
    }

    throw new Error(`Output format is not supported for mode ${pixelImage.mode.id}`);
  }

  public static async save(image: IBinaryFormat, outFile: string): Promise<void> {
    return fs.writeFile(outFile, Buffer.from(C64Layout.concat(image.toMemoryMap())));
  }

  private static async saveExecutable(image: IBinaryFormat, outFile: string): Promise<void> {
    const appDir: string = path.dirname(require.main.filename);
    const viewerFile: string = path.join(appDir, `${this.viewersFolder}${image.formatName}.prg`);
    let viewerCode;

    try {
      viewerCode = await fs.readFile(viewerFile);
    } catch (error) {
      throw new Error(`Executable format is not supported for ${image.formatName}`);
    }

    const buffer: Buffer = Buffer.from(C64Layout.concat(image.toMemoryMap()));
    const writeBuffer = Buffer.concat([viewerCode, buffer]);

    return fs.writeFile(outFile, writeBuffer);
  }
}
