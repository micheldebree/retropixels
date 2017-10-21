import { ColorMap } from '../model/ColorMap';
import { PixelImage } from '../model/PixelImage';

export class C64Mapper {

  public indexMap = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
  };

  public FLIBugSize = 0;

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
          bitmap[bitmapIndex] = packedByte;
          bitmapIndex++;
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
    return this.indexMap[pixelImage.getPixelIndex(x, y)];
  }

}
