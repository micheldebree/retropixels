export default class Palette {
  public pixels: number[][];

  constructor(pixels: number[][]) {
    this.pixels = pixels === undefined ? [] : pixels;
  }

  public get(index: number): number[] {
    return this.pixels[index];
  }
}
