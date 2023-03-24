/**
 * Maps x, y coordinates to a pixel value.
 * The map has a certain resolution specifying the size of an area of the same color.
 * @param {PixelImage} pixelImage - Image to extract the color map from.
 * @param {number} width - Width of the map in pixels
 * @param {number} height - Height of the map in pixels
 * @param {number} [resX] - Number of horizontal pixels in color areas.
 * @param {number} [resY] - Number of vertical pixels in color areas.
 *
 * A color is an index into a palette. A pixel is a set of RGBA values.
 */

export default class ColorMap {
  public colors: number[][]

  public width: number

  public height: number

  public resX: number

  public resY: number

  constructor (widthVal: number, heightVal: number, resXVal: number = widthVal, resYVal: number = heightVal) {
    this.colors = []
    this.width = widthVal
    this.height = heightVal
    this.resX = resXVal
    this.resY = resYVal
  }

  /**
   * Set an area to a certain color.
   * @param {number} x            x coordinate
   * @param {number} y            y coordinate
   * @param {number} paletteIndex
   */
  public put (x: number, y: number, paletteIndex: number): void {
    if (!this.isInRange(x, y)) {
      return
    }

    const rx: number = this.mapX(x)

    // add it to the color map
    if (this.colors[rx] === undefined) {
      this.colors[rx] = []
    }
    this.colors[rx][this.mapY(y)] = paletteIndex
  }

  /**
   * Get the palette index at x, y coordinate.
   * TODO: rename to getIndex
   */
  public get (x: number, y: number): number | undefined {
    const mX: number = this.mapX(x)

    if (this.colors[mX] !== undefined) {
      return this.colors[mX][this.mapY(y)]
    }
    return undefined
  }

  public getNonEmpty (x: number, y: number): number {
    const result: number | undefined = this.get(x, y)
    if (result === undefined) {
      throw new Error(`Index at ${x}, ${y} is undefined.`)
    }
    return result
  }

  // if there is no index at x,y because it is not needed,
  // return the default
  public getIndexOrDefault (x: number, y: number): number {
    return this.get(x,y)?? 0
  }

  public forEachCell (callback: (x: number, y: number) => void): void {
    for (let x = 0; x < this.width; x += this.resX) {
      for (let y = 0; y < this.height; y += this.resY) {
        callback(x, y)
      }
    }
  }

  /**
   * Execute callback for each pixel coordinate covered by a cell
   * @param x left coordinate of the cell
   * @param y top coordinate of the cell
   * @param callback Callback function, receiving absolute pixel coordinates
   */
  public forEachPixelInCell (x: number, y: number, callback: (x: number, y: number) => void): void {
    for (let ix: number = x; ix < x + this.resX; ix += 1) {
      for (let iy: number = y; iy < y + this.resY; iy += 1) {
        callback(ix, iy)
      }
    }
  }

  private isInRange (x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height
  }

  private mapX (x: number): number {
    return Math.floor(x / this.resX)
  }

  private mapY (y: number): number {
    return Math.floor(y / this.resY)
  }
}
