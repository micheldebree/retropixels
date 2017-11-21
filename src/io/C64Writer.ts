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
import { IC64Format } from './IC64Format';

export class C64Writer {
  // Save PixelImage as a c64 native .PRG executable.
  public static savePrg(pixelImage: PixelImage, outFile: string, callback: () => {}) {
    const picture: IC64Format = C64Writer.getFormat(pixelImage);
    picture.fromPixelImage(pixelImage);
    C64Writer.saveExecutable(picture, outFile, callback);
  }

  public static saveBinary(pixelImage: PixelImage, outFile: string, callback: () => {}) {
    const picture: IC64Format = C64Writer.getFormat(pixelImage);
    picture.fromPixelImage(pixelImage);
    C64Writer.save(picture, outFile, callback);
  }

  private static viewersFolder: string = '/target/c64/';

  // TODO: support multiple output formats per GraphicMode
  private static getFormat(pixelImage: PixelImage): IC64Format {
    if (pixelImage.mode === GraphicModes.c64Multicolor) {
      return new KoalaPicture();
    }

    if (pixelImage.mode === GraphicModes.c64FLI) {
      return new FLIPicture();
    }

    if (pixelImage.mode === GraphicModes.c64AFLI) {
      return new AFLIPicture();
    }

    if (pixelImage.mode === GraphicModes.c64Hires || pixelImage.mode === GraphicModes.c64HiresMono) {
      return new HiresPicture();
    }

    if (pixelImage.mode === GraphicModes.c64HiresSprites || pixelImage.mode === GraphicModes.c64MulticolorSprites) {
      return new SpritePad();
    }
    throw new Error('Output format is not supported for mode ' + pixelImage.mode);
  }

  private static save(image: IC64Format, outFile: string, callback: () => {}) {
    C64Writer.writeFile(outFile, new Buffer(C64Layout.concat(image.toMemoryMap())), callback);
  }

  private static saveExecutable(image: IC64Format, outFile: string, callback: () => {}) {
    // https://stackoverflow.com/questions/10265798/determine-project-root-from-a-running-node-js-application
    const appDir: string = path.dirname(require.main.filename);
    const viewerFile: string = path.join(appDir, this.viewersFolder + image.formatName + '.prg');

    fs.readFile(viewerFile, (readError, viewerCode) => {
      if (readError) {
        throw readError;
      }
      const buffer: Buffer = new Buffer(C64Layout.concat(image.toMemoryMap()));
      const writeBuffer: Buffer = Buffer.concat([viewerCode, buffer]);
      C64Writer.writeFile(outFile, writeBuffer, callback);
    });
  }

  private static writeFile(filename: string, buffer: Buffer, callback: () => {}) {
    fs.writeFile(filename, buffer, writeError => {
      if (writeError) {
        throw writeError;
      }
      if (callback) {
        return callback();
      }
    });
  }
}
