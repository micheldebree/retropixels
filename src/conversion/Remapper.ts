import { ColorMap } from '../model/ColorMap';
import { ImageData } from '../model/ImageData';
import { ImageDataInterface } from '../model/ImageDataInterface';
import { PixelImage } from '../model/PixelImage';

/**
 * Maps ImageData onto a PixelImage
 * TODO: does not support different palettes per colorMap
 * TODO: rename to ColorMapOptimizer or something
 * TODO: move drawImageData to another class. This is just for optimizing.
 * @param  {PixelImage} image The PixelImage to map ImageData to
 */
export class Remapper {

    public image: PixelImage;

    constructor(image: PixelImage) {
        this.image = image;
    }

    /**
     * Create optimal ColorMaps according to ImageData
     * @param {ImageDataInterface} imageData [description]
     */
    public optimizeColorMaps(imageData: ImageDataInterface): void {
        const colorMap: ColorMap = this.getColorMap(imageData, this.image);
        // fill up the colormaps in the restricted image based on the colors in the unrestricted image
        for (const map of this.image.colorMaps) {
            this.extractColorMap(colorMap, map);
        }
    }

    /**
     * Map ImageData on the PixelImage
     * @param  {ImageDataInterface} imageData The ImageData to map
     */
    public drawImageData(imageData: ImageDataInterface): void {
        for (let y: number = 0; y < this.image.height; y += 1) {
            for (let x: number = 0; x < this.image.width; x += 1) {
                this.image.poke(x, y, ImageData.peek(imageData, x, y));
            }
        }
    }

    // TODO: now uses palette of first color map only
    private getColorMap(imageData: ImageDataInterface, targetPixelImage: PixelImage): ColorMap {
        const w: number = imageData.width;
        const h: number = imageData.height;
        const unrestrictedImage: PixelImage = new PixelImage(w, h, targetPixelImage.pWidth, targetPixelImage.pHeight);
        const palette = targetPixelImage.colorMaps[0].palette;
        unrestrictedImage.colorMaps.push(new ColorMap(w, h, palette, 1, 1));
        unrestrictedImage.quantizer = unrestrictedImage.quantizer;
        ImageData.drawImageData(imageData, unrestrictedImage);
        return unrestrictedImage.colorMaps[0];
    }

    private reduceToMax(colorMap: ColorMap, x: number, y: number, w: number, h: number): number {
        const weights: number[] = [];
        let maxWeight: number;
        let maxColor: number;

        for (let ix: number = x; ix < x + w; ix += 1) {
            for (let iy: number = y; iy < y + h; iy += 1) {
                const colorIndex: number = colorMap.get(ix, iy);
                if (colorIndex !== undefined) {
                    weights[colorIndex] = weights[colorIndex] === undefined ? 1 : weights[colorIndex] + 1;
                    if (maxWeight === undefined || weights[colorIndex] > maxWeight) {
                        maxWeight = weights[colorIndex];
                        maxColor = colorIndex;
                    }
                }
            }
        }
        return maxColor;
    }

    /**
     * Delete colors from one colorMap and put them in another.
     */
    private extractColorMap(fromColorMap: ColorMap, toColorMap: ColorMap): void {
        const rx: number = toColorMap.resX;
        const ry: number = toColorMap.resY;

        for (let x: number = 0; x < toColorMap.width; x += rx) {
            for (let y: number = 0; y < toColorMap.height; y += ry) {
                toColorMap.put(x, y, this.reduceToMax(fromColorMap, x, y, rx, ry));
            }
        }
        fromColorMap.subtract(toColorMap);
    }

}
