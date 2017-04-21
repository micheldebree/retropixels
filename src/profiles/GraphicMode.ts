import { PixelImage } from '../model/PixelImage';

/**
 * A specific Graphic Mode.
 * Includes a factory for creating new PixelImages in this mode.
 */
export class GraphicMode {
  width: number;
  height: number;
  pixelWidth: number;
  pixelHeight: number;
  factory: () => PixelImage; 

  constructor(width: number, height: number, factory: () => any, pixelWidth: number = 1, pixelHeight: number = 1) {
    this.width = width;
    this.height = height;
    this.pixelWidth = pixelWidth;
    this.pixelHeight = pixelHeight;
  }
}