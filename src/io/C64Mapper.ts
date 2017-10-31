import * as fs from 'fs-extra';
import * as path from 'path';
import { ColorMap } from '../model/ColorMap';
import { PixelImage } from '../model/PixelImage';

/**
 * A factory for creating Commodore 64 files from PixelImages.
 */
export class C64Mapper {
  public static pad(buffer: Uint8Array, numberOfBytes: number): Uint8Array {
    return this.concat([buffer, new Uint8Array(numberOfBytes)]);
  }

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

  public indexMap = {
    0: 0,
    1: 1,
    2: 2,
    3: 3
  };

  public FLIBugSize: number = 0;

  // The filename containing viewer code for executables.
  public viewerFilename: string;
  private viewersFolder: string = '/target/c64/';

  // Save PixelImage as a KoalaPaint image.
  public save(memoryMap: Uint8Array[], outFile: string, callback: () => {}) {
    fs.writeFile(outFile, new Buffer(C64Mapper.concat(memoryMap)), (err: Error) => {
      if (err) {
        throw err;
      }
      return callback();
    });
  }

  // Save PixelImage as a c64 native .PRG executable.
  public saveExecutable(memoryMap: Uint8Array[], outFile: string, callback: () => {}) {
    if (!this.viewerFilename) {
      throw new Error('Filename for viewercode is not set.');
    }

    // https://stackoverflow.com/questions/10265798/determine-project-root-from-a-running-node-js-application
    const appDir: string = path.dirname(require.main.filename);
    const viewerFile: string = path.join(appDir, this.viewersFolder + this.viewerFilename);

    fs.readFile(viewerFile, (readError, viewerCode) => {
      if (readError) {
        throw readError;
      }
      const buffer: Buffer = new Buffer(C64Mapper.concat(memoryMap));
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

  public convertBitmap(pixelImage: PixelImage): Uint8Array {
    const bitmap: Uint8Array = new Uint8Array(8000);
    let bitmapIndex: number = 0;

    const verticalPixelsPerCell: number = 8 / pixelImage.pHeight;
    const horizontalPixelsPerCell: number = 8 / pixelImage.pWidth;

    this.forEachCell(pixelImage, 0, (x, y) => {
      this.forEachByte(pixelImage, x, y, yyy => {
        // pack one character's row worth of pixels into one byte
        let packedByte: number = 0;
        if (x > this.FLIBugSize) {
          for (let pixelX: number = 0; pixelX < horizontalPixelsPerCell; pixelX++) {
            const shiftTimes = (horizontalPixelsPerCell - 1 - pixelX) * pixelImage.pWidth;
            const xx = x + pixelX;
            packedByte = packedByte | (this.mapPixelIndex(pixelImage, xx, yyy) << shiftTimes);
          }
        }
        bitmap[bitmapIndex++] = packedByte;
      });
    });

    return bitmap;
  }

  public forEachByte(pixelImage, cellX, cellY, callback: (byteY) => void) {
    const verticalPixelsPerCell: number = 8 / pixelImage.pHeight;

    for (let byteY = cellY; byteY < cellY + verticalPixelsPerCell; byteY++) {
      callback(byteY);
    }
  }

  public convertScreenram(
    pixelImage: PixelImage,
    lowerColorIndex: number,
    upperColorIndex: number,
    yOffset: number = 0
  ): Uint8Array {
    return this.extractAttributeData(pixelImage, yOffset, (x, y) => {
      // pack two colors in one byte
      return (
        ((pixelImage.colorMaps[upperColorIndex].get(x, y) << 4) & 0xf0) |
        (pixelImage.colorMaps[lowerColorIndex].get(x, y) & 0x0f)
      );
    });
  }

  public convertColorram(pixelImage: PixelImage, colorMapIndex: number): Uint8Array {
    return this.extractAttributeData(pixelImage, 0, (x, y) => {
      return pixelImage.colorMaps[colorMapIndex].get(x, y) & 0x0f;
    });
  }

  private extractAttributeData(
    pixelImage: PixelImage,
    yOffset: number,
    callback: (x: number, y: number) => number
  ): Uint8Array {
    const result: Uint8Array = new Uint8Array(1000).fill(0);
    let index: number = 0;

    this.forEachCell(pixelImage, yOffset, (x, y) => {
      result[index++] = x > this.FLIBugSize ? callback(x, y) : 0;
    });
    return result;
  }

  private forEachCell(pixelImage: PixelImage, yOffset = 0, callback: (x: number, y: number) => void): void {
    const verticalPixelsPerCell: number = 8 / pixelImage.pHeight;
    const horizontalPixelsPerCell: number = 8 / pixelImage.pWidth;

    for (let y: number = yOffset; y < pixelImage.height; y += verticalPixelsPerCell) {
      for (let x: number = 0; x < pixelImage.width; x += horizontalPixelsPerCell) {
        callback(x, y);
      }
    }
  }

  private mapPixelIndex(pixelImage: PixelImage, x: number, y: number) {
    return this.indexMap[pixelImage.pixelIndex[y][x]];
  }
}
