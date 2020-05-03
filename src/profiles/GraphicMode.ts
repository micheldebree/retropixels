import Palette from '../model/Palette';
import PixelImage from '../model/PixelImage';

/**
 * A specific Graphic Mode.
 * Includes a factory for creating new PixelImages in this mode.
 */
export default class GraphicMode {
  // width and height in pixels
  public width: number;

  public height: number;

  // width and height of one pixel
  public pixelWidth = 1;

  public pixelHeight = 1;

  public palette: Palette;

  public rowsPerCell = 8;

  public bytesPerCellRow = 1;

  public fliBugSize = 0;

  public indexMap = {
    0: 0,
    1: 1,
    2: 2,
    3: 3
  };

  // creates an empty PixelImage for this GraphicMode.
  public factory: () => PixelImage;

  constructor(width: number, height: number, palette: Palette, factory: () => PixelImage) {
    this.width = width;
    this.height = height;
    this.palette = palette;
    this.factory = factory;

    // console.log('Graphicmode:');
    // console.log('------------');
    // console.log(width + ' x ' + height + ' pixels');
    // console.log(this.pixelsPerByte() + ' pixels per byte');
  }

  public mapPixelIndex(pixelImage: PixelImage, x: number, y: number): number {
    if (x >= pixelImage.mode.width || x < 0) {
      throw new Error(`x value out of bounds: ${x}`);
    }
    if (y >= pixelImage.mode.height || y < 0) {
      throw new Error(`y value out of bounds: ${y}`);
    }
    return this.indexMap[pixelImage.pixelIndex[y][x]];
  }

  public pixelsPerByte(): number {
    return 8 / this.pixelWidth;
  }

  public pixelsPerCellRow(): number {
    return this.bytesPerCellRow * this.pixelsPerByte();
  }

  public extractAttributeData(
    pixelImage: PixelImage,
    yOffset: number,
    callback: (x: number, y: number) => number
  ): Uint8Array {
    const result: Uint8Array = new Uint8Array(1000).fill(0);
    let index = 0;

    this.forEachCell(yOffset, (x, y) => {
      result[index] = x >= this.fliBugSize ? callback(x, y) : 0;
      index += 1;
    });
    return result;
  }

  /**
   * Execute for each row in a cell.
   * @param pixelImage The image
   * @param cellX The left of the cell
   * @param cellY The top of the cell
   * @param callback
   */
  public forEachCellRow(cellY: number, callback: (y) => void): void {
    for (let rowY = cellY; rowY < cellY + this.rowsPerCell; rowY += 1) {
      callback(rowY);
    }
  }

  /**
   * Execute for each cell in the image.
   * @param pixelImage The image
   * @param yOffset Added to the y coordinate of the cell top
   * @param callback Called with the topleft position in the image of the cell.
   */
  public forEachCell(yOffset = 0, callback: (x: number, y: number) => void): void {
    const pixelsPerCellRow: number = this.pixelsPerCellRow();

    for (let y: number = yOffset; y < this.height; y += this.rowsPerCell) {
      for (let x = 0; x < this.width; x += pixelsPerCellRow) {
        callback(x, y);
      }
    }
  }

  public forEachByte(cellX: number, callback: (x) => void): void {
    const pixelsPerByte: number = this.pixelsPerByte();
    for (let byteX = cellX; byteX < cellX + this.bytesPerCellRow * pixelsPerByte; byteX += pixelsPerByte) {
      callback(byteX);
    }
  }

  public forEachPixel(byteX: number, callback: (x: number, shiftTimes: number) => void): void {
    const pixelsPerByte: number = this.pixelsPerByte();

    for (let pixelX = 0; pixelX < pixelsPerByte; pixelX += 1) {
      const shiftTimes = (pixelsPerByte - 1 - pixelX) * this.pixelWidth;
      callback(byteX + pixelX, shiftTimes);
    }
  }
}
