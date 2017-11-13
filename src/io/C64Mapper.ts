import { ColorMap } from '../model/ColorMap';
import { PixelImage } from '../model/PixelImage';
import { GraphicMode } from '../profiles/GraphicMode';
import { C64Format } from './C64Format';

/**
 * A factory for creating Commodore 64 files from PixelImages.
 */
export class C64Mapper {
  public mode: GraphicMode;

  public constructor(mode: GraphicMode) {
    this.mode = mode;
  }

  public convertBitmap(pixelImage: PixelImage): Uint8Array {
    const bitmap: Uint8Array = new Uint8Array(8000);
    let bitmapIndex: number = 0;

    this.forEachCell(0, (x, y) => {
      this.forEachCellRow(y, rowY => {
        // pack one character's row worth of pixels into one byte
        this.forEachByte(x, byteX => {
          let packedByte: number = 0;
          if (byteX >= this.mode.FLIBugSize) {
            this.forEachPixel(byteX, (pixelX, shiftTimes) => {
              packedByte = packedByte | (this.mode.mapPixelIndex(pixelImage, pixelX, rowY) << shiftTimes);
            });
          }
          bitmap[bitmapIndex++] = packedByte;
        });
      });
    });

    return bitmap;
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

    this.forEachCell(yOffset, (x, y) => {
      result[index++] = x >= this.mode.FLIBugSize ? callback(x, y) : 0;
    });
    return result;
  }

  /**
   * Execute for each cell in the image.
   * @param pixelImage The image
   * @param yOffset Added to the y coordinate of the cell top
   * @param callback Called with the topleft position in the image of the cell.
   */
  private forEachCell(yOffset = 0, callback: (x: number, y: number) => void): void {
    const pixelsPerCellRow: number = this.mode.pixelsPerCellRow();

    for (let y: number = yOffset; y < this.mode.height; y += this.mode.rowsPerCell) {
      for (let x: number = 0; x < this.mode.width; x += pixelsPerCellRow) {
        callback(x, y);
      }
    }
  }

  /**
   * Execute for each row in a cell.
   * @param pixelImage The image
   * @param cellX The left of the cell
   * @param cellY The top of the cell
   * @param callback
   */
  private forEachCellRow(cellY: number, callback: (y) => void) {
    for (let rowY = cellY; rowY < cellY + this.mode.rowsPerCell; rowY++) {
      callback(rowY);
    }
  }

  private forEachByte(cellX: number, callback: (x) => void) {
    for (let byteX = cellX; byteX < cellX + this.mode.bytesPerCellRow; byteX++) {
      callback(byteX);
    }
  }

  private forEachPixel(byteX: number, callback: (x: number, shiftTimes: number) => void) {
    const pixelsPerByte: number = this.mode.pixelsPerByte();

    for (let pixelX: number = 0; pixelX < pixelsPerByte; pixelX++) {
      const shiftTimes = (pixelsPerByte - 1 - pixelX) * this.mode.pixelWidth;
      callback(byteX + pixelX, shiftTimes);
    }
  }
}
