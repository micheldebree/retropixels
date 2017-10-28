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
    3: 3,
  };

  public FLIBugSize: number = 0;

  // The filename containing viewer code for executables.
  public viewerFilename: string;
  private viewersFolder: string = '/target/c64/';

  // Save PixelImage as a KoalaPaint image.
  public save(memoryMap: Uint8Array[], outFile: string, callback: () => {}) {

    fs.writeFile(outFile, new Buffer(C64Mapper.concat(memoryMap)), (err: Error) => {
      if (err) { throw err; }
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
      if (readError) { throw readError; }
      const buffer: Buffer = new Buffer(C64Mapper.concat(memoryMap));
      const writeBuffer: Buffer = Buffer.concat([viewerCode, buffer]);
      fs.writeFile(outFile, writeBuffer, (writeError) => {
        if (writeError) { throw writeError; }
        if (callback) { return callback(); }
      });
    });
  }

  public convertBitmap(pixelImage: PixelImage): Uint8Array {
    const bitmap: Uint8Array = new Uint8Array(8000);
    let bitmapIndex: number = 0;

    const verticalPixelsPerChar: number = 8 / pixelImage.pHeight;
    const horizontalPixelsPerChar: number = 8 / pixelImage.pWidth;

    for (let charY: number = 0; charY < pixelImage.height; charY += verticalPixelsPerChar) {
      for (let charX: number = 0; charX < pixelImage.width; charX += horizontalPixelsPerChar) {
        for (let pixelY: number = 0; pixelY < verticalPixelsPerChar; pixelY++) {
          // pack one character's row worth of pixels into one byte
          const y = charY + pixelY;
          let packedByte: number = 0;
          if (charX > this.FLIBugSize) {
            for (let pixelX: number = 0; pixelX < horizontalPixelsPerChar; pixelX++) {
              const shiftTimes = (horizontalPixelsPerChar - 1 - pixelX) * pixelImage.pWidth;
              const x = charX + pixelX;
              packedByte = packedByte | this.mapPixelIndex(pixelImage, x, y) << shiftTimes;
            }
          }
          bitmap[bitmapIndex++] = packedByte;
        }
      }
    }
    return bitmap;
  }

  public convertScreenram(pixelImage: PixelImage,
                          lowerColorIndex: number, upperColorIndex: number,
                          yOffset: number = 0): Uint8Array {

    const screenRam: Uint8Array = new Uint8Array(1000);
    let colorIndex: number = 0;
    const lowerColorMap = pixelImage.colorMaps[lowerColorIndex];
    const upperColorMap = pixelImage.colorMaps[upperColorIndex];

    const verticalPixelsPerChar: number = 8 / pixelImage.pHeight;
    const horizontalPixelsPerChar: number = 8 / pixelImage.pWidth;

    for (let colorY: number = yOffset; colorY < lowerColorMap.height; colorY += verticalPixelsPerChar) {
      for (let colorX: number = 0; colorX < lowerColorMap.width; colorX += horizontalPixelsPerChar) {
        // pack two colors in one byte
        if (colorX > this.FLIBugSize) {
          screenRam[colorIndex] = ((upperColorMap.get(colorX, colorY) << 4) & 0xf0)
            | (lowerColorMap.get(colorX, colorY) & 0x0f);
        }
        colorIndex++;
      }
    }
    return screenRam;
  }

  public convertColorram(pixelImage: PixelImage, colorMapIndex: number): Uint8Array {
    const imageW: number = pixelImage.width;
    const imageH: number = pixelImage.height;
    const colorRam: Uint8Array = new Uint8Array(1000);
    let colorIndex: number = 0;

    const verticalPixelsPerChar: number = 8 / pixelImage.pHeight;
    const horizontalPixelsPerChar: number = 8 / pixelImage.pWidth;
    const colorMap = pixelImage.colorMaps[colorMapIndex];

    for (let colorY: number = 0; colorY < imageH; colorY += verticalPixelsPerChar) {
      for (let colorX: number = 0; colorX < imageW; colorX += horizontalPixelsPerChar) {
        if (colorX > this.FLIBugSize) {
          colorRam[colorIndex] = colorMap.get(colorX, colorY) & 0x0f;
        }
        colorIndex++;
      }
    }
    return colorRam;
  }

  private mapPixelIndex(pixelImage: PixelImage, x: number, y: number) {
    return this.indexMap[pixelImage.pixelIndex[y][x]];
  }

}
