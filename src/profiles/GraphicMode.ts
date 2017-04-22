import { PixelImage } from '../model/PixelImage';

/**
 * A specific Graphic Mode.
 * Includes a factory for creating new PixelImages in this mode.
 */
export class GraphicMode {

    // width and height in pixels
    width: number;
    height: number;

    // width and height of one pixel
    pixelWidth: number;
    pixelHeight: number;

    // creates an empty PixelImage for this GraphicMode.
    factory: () => PixelImage;

    constructor(width: number, height: number, pixelWidth: number = 1, pixelHeight: number = 1, factory: () => PixelImage) {
        this.width = width;
        this.height = height;
        this.pixelWidth = pixelWidth;
        this.pixelHeight = pixelHeight;
        this.factory = factory;
    }
}