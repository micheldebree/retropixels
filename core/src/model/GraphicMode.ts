/**
 * A specific Graphic Mode.
 * Includes a factory for creating new PixelImages in this mode.
 */
export default class GraphicMode {
  public id: string

  // width and height in pixels
  public width: number

  public height: number

  // width and height of one pixel
  public pixelWidth = 1

  public pixelHeight = 1

  public rowsPerCell = 8

  public bytesPerCellRow = 1

  public fliBugSize = 0

  public indexMap = {
    0: 0,
    1: 1,
    2: 2,
    3: 3
  }

  constructor (id: string, width: number, height: number) {
    this.id = id
    this.width = width
    this.height = height
  }

  public pixelsPerByte (): number {
    return 8 / this.pixelWidth
  }

  public pixelsPerCellRow (): number {
    return this.bytesPerCellRow * this.pixelsPerByte()
  }

  /**
   * Execute for each row in a cell.
   * @param cellY The top of the cell
   * @param callback
   */
  public forEachCellRow (cellY: number, callback: (y: number) => void): void {
    for (let rowY = cellY; rowY < cellY + this.rowsPerCell; rowY += 1) {
      callback(rowY)
    }
  }

  /**
   * Execute for each cell in the image.
   * @param yOffset Added to the y coordinate of the cell top
   * @param callback Called with the top left position in the image of the cell.
   */
  public forEachCell (yOffset: number, callback: (x: number, y: number) => void): void {
    const pixelsPerCellRow: number = this.pixelsPerCellRow()

    for (let y: number = yOffset; y < this.height; y += this.rowsPerCell) {
      for (let x = 0; x < this.width; x += pixelsPerCellRow) {
        callback(x, y)
      }
    }
  }

  public forEachByte (cellX: number, callback: (x: number) => void): void {
    const pixelsPerByte: number = this.pixelsPerByte()
    for (let byteX = cellX; byteX < cellX + this.bytesPerCellRow * pixelsPerByte; byteX += pixelsPerByte) {
      callback(byteX)
    }
  }

  public forEachPixel (byteX: number, callback: (x: number, shiftTimes: number) => void): void {
    const pixelsPerByte: number = this.pixelsPerByte()

    for (let pixelX = 0; pixelX < pixelsPerByte; pixelX += 1) {
      const shiftTimes = (pixelsPerByte - 1 - pixelX) * this.pixelWidth
      callback(byteX + pixelX, shiftTimes)
    }
  }
}
