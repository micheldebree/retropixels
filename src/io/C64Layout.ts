import { PixelImage } from '../model/PixelImage';
import { GraphicMode } from '../profiles/GraphicMode';

export class C64Layout {
  public static concat(arrayBuffers: Uint8Array[]): Uint8Array {
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

  public static pad(buffer: Uint8Array, numberOfBytes: number): Uint8Array {
    return this.concat([buffer, new Uint8Array(numberOfBytes)]);
  }

  public static convertBitmap(pixelImage: PixelImage): Uint8Array {
    // TODO: calculate size of bitmap
    const bitmap: Uint8Array = new Uint8Array(8000);
    let bitmapIndex: number = 0;

    pixelImage.mode.forEachCell(0, (x, y) => {
      pixelImage.mode.forEachCellRow(y, rowY => {
        // pack one character's row worth of pixels into one byte
        pixelImage.mode.forEachByte(x, byteX => {
          let packedByte: number = 0;
          if (byteX >= pixelImage.mode.FLIBugSize) {
            pixelImage.mode.forEachPixel(byteX, (pixelX, shiftTimes) => {
              packedByte = packedByte | (pixelImage.mode.mapPixelIndex(pixelImage, pixelX, rowY) << shiftTimes);
            });
          }
          bitmap[bitmapIndex++] = packedByte;
        });
      });
    });

    return bitmap;
  }

  public static convertScreenram(
    pixelImage: PixelImage,
    lowerColorIndex: number,
    upperColorIndex: number,
    yOffset: number = 0
  ): Uint8Array {
    return pixelImage.mode.extractAttributeData(pixelImage, yOffset, (x, y) => {
      // pack two colors in one byte
      return (
        ((pixelImage.colorMaps[upperColorIndex].get(x, y) << 4) & 0xf0) |
        (pixelImage.colorMaps[lowerColorIndex].get(x, y) & 0x0f)
      );
    });
  }

  public static convertColorram(pixelImage: PixelImage, colorMapIndex: number): Uint8Array {
    return pixelImage.mode.extractAttributeData(pixelImage, 0, (x, y) => {
      return pixelImage.colorMaps[colorMapIndex].get(x, y) & 0x0f;
    });
  }
}
