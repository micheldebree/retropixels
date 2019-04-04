import * as fs from 'fs-extra';
import * as path from 'path';
import { AFLIPicture } from '../io/AFLIPicture';
import { FLIPicture } from '../io/FLIPicture';
import { HiresPicture } from '../io/HiresPicture';
import { KoalaPicture } from '../io/KoalaPicture';
import { SpritePad } from '../io/SpritePad';
import { PixelImage } from '../model/PixelImage';
import { GraphicModes } from '../profiles/GraphicModes';
import { C64Layout } from './C64Layout';
import { IBinaryFormat } from './IBinaryFormat';

export class C64Writer {
  // Save PixelImage as a c64 native .PRG executable.
  public static async savePrg(pixelImage: PixelImage, outFile: string) {
    const picture: IBinaryFormat = C64Writer.getFormat(pixelImage);
    picture.fromPixelImage(pixelImage);
    return await C64Writer.saveExecutable(picture, outFile);
  }

  public static async saveBinary(pixelImage: PixelImage, outFile: string) {
    const picture: IBinaryFormat = C64Writer.getFormat(pixelImage);
    picture.fromPixelImage(pixelImage);
    return await C64Writer.save(picture, outFile);
  }

  private static viewersFolder: string = '/target/c64/';

  // TODO: support multiple output formats per GraphicMode
  private static getFormat(pixelImage: PixelImage): IBinaryFormat {
    if (pixelImage.mode === GraphicModes.c64Multicolor) {
      return new KoalaPicture();
    }

    if (pixelImage.mode === GraphicModes.c64FLI) {
      return new FLIPicture();
    }

    if (pixelImage.mode === GraphicModes.c64AFLI) {
      return new AFLIPicture();
    }

    if (
      pixelImage.mode === GraphicModes.c64Hires ||
      pixelImage.mode === GraphicModes.c64HiresMono
    ) {
      return new HiresPicture();
    }

    if (
      pixelImage.mode === GraphicModes.c64HiresSprites ||
      pixelImage.mode === GraphicModes.c64MulticolorSprites
    ) {
      return new SpritePad();
    }
    throw new Error(`Output format is not supported for mode ${pixelImage.mode}`);
  }

  private static async save(image: IBinaryFormat, outFile: string) {
    return await fs.writeFile(outFile, Buffer.from(C64Layout.concat(image.toMemoryMap())));
  }

  private static async saveExecutable(image: IBinaryFormat, outFile: string) {
    const appDir: string = path.dirname(require.main.filename);
    const viewerFile: string = path.join(appDir, `${this.viewersFolder}${image.formatName}.prg`);
    const viewerCode = await fs.readFile(viewerFile);
    const buffer: Buffer = Buffer.from(C64Layout.concat(image.toMemoryMap()));
    const writeBuffer = Buffer.concat([viewerCode, buffer]);

    return await fs.writeFile(outFile, writeBuffer);
  }
}
