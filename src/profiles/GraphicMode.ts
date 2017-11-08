import { PixelImage } from '../model/PixelImage';

/**
 * A specific Graphic Mode.
 * Includes a factory for creating new PixelImages in this mode.
 */
export class GraphicMode {
  // width and height in pixels
  public width: number;
  public height: number;

  // width and height of one pixel
  public pixelWidth: number = 1;
  public pixelHeight: number = 1;

  public rowsPerCell: number = 8;
  public bytesPerCellRow: number = 1;

  public FLIBugSize: number = 0;

  public indexMap = {
    0: 0,
    1: 1,
    2: 2,
    3: 3
  };

  // creates an empty PixelImage for this GraphicMode.
  public factory: () => PixelImage;

  constructor(width: number, height: number, factory: () => PixelImage) {
    this.width = width;
    this.height = height;
    this.factory = factory;
  }

  public mapPixelIndex(pixelImage: PixelImage, x: number, y: number) {
    return this.indexMap[pixelImage.pixelIndex[y][x]];
  }

  public pixelsPerByte(): number {
    return 8 / this.pixelWidth;
  }

  public pixelsPerCellRow(): number {
    return this.bytesPerCellRow * this.pixelsPerByte();
  }

}
