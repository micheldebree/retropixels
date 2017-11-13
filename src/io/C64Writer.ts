import * as fs from 'fs-extra';
import * as path from 'path';
import { PixelImage } from '../model/PixelImage';
import { C64Layout } from './C64Layout';
import { IC64Format } from './IC64Format';
export class C64Writer {
  // Save PixelImage as a KoalaPaint image.
  public static save(image: IC64Format, outFile: string, callback: () => {}) {
    fs.writeFile(outFile, new Buffer(C64Layout.concat(image.toMemoryMap())), (err: Error) => {
      if (err) {
        throw err;
      }
      return callback();
    });
  }

  // Save PixelImage as a c64 native .PRG executable.
  public static saveExecutable(image: IC64Format, outFile: string, callback: () => {}) {
    // https://stackoverflow.com/questions/10265798/determine-project-root-from-a-running-node-js-application
    const appDir: string = path.dirname(require.main.filename);
    const viewerFile: string = path.join(appDir, this.viewersFolder + image.formatName + '.prg');

    fs.readFile(viewerFile, (readError, viewerCode) => {
      if (readError) {
        throw readError;
      }
      const buffer: Buffer = new Buffer(C64Layout.concat(image.toMemoryMap()));
      const writeBuffer: Buffer = Buffer.concat([viewerCode, buffer]);
      fs.writeFile(outFile, writeBuffer, writeError => {
        if (writeError) {
          throw writeError;
        }
        if (callback) {
          return callback();
        }
      });
    });
  }

  private static viewersFolder: string = '/target/c64/';
}
