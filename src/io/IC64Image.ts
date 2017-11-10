import * as fs from 'fs-extra';
import * as path from 'path';
import { PixelImage } from '../model/PixelImage';
import { GraphicMode } from '../profiles/GraphicMode';

import { C64Mapper } from './C64Mapper';

export abstract class IC64Image {
  private static concat(arrayBuffers: Uint8Array[]): Uint8Array {
    if (arrayBuffers.length === 1) {
      return arrayBuffers[0];
    }

    return arrayBuffers.reduce((total, current) => {
      const result = new Uint8Array(total.length + current.length);
      result.set(total, 0);
      result.set(current, total.length);
      return result;
    });
  }

  public abstract formatName: string;
  private viewersFolder: string = '/target/c64/';

  public abstract fromPixelImage(pixelImage: PixelImage);
  public abstract toMemoryMap(): Uint8Array[];

  // Save PixelImage as a c64 native .PRG executable.
  public saveExecutable(outFile: string, callback: () => {}) {
    // https://stackoverflow.com/questions/10265798/determine-project-root-from-a-running-node-js-application
    const appDir: string = path.dirname(require.main.filename);
    const viewerFile: string = path.join(appDir, this.viewersFolder + this.formatName + '.prg');

    fs.readFile(viewerFile, (readError, viewerCode) => {
      if (readError) {
        throw readError;
      }
      const buffer: Buffer = new Buffer(IC64Image.concat(this.toMemoryMap()));
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

  // Save PixelImage as a KoalaPaint image.
  public save(outFile: string, callback: () => {}) {
    fs.writeFile(outFile, new Buffer(IC64Image.concat(this.toMemoryMap())), (err: Error) => {
      if (err) {
        throw err;
      }
      return callback();
    });
  }

  protected pad(buffer: Uint8Array, numberOfBytes: number): Uint8Array {
    return IC64Image.concat([buffer, new Uint8Array(numberOfBytes)]);
  }
}
