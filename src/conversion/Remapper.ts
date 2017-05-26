import { PixelImage } from '../model/PixelImage';
import { ColorMap } from '../model/ColorMap';
import { ImageData } from '../model/ImageData';
import { ImageDataInterface } from '../model/ImageDataInterface';

/**
 * Maps ImageData onto a PixelImage
 * TODO: does not support different palettes per colorMap
 * TODO: rename
 * @param  {PixelImage} image The PixelImage to map ImageData to
 */
export class Remapper {

    image: PixelImage;

    constructor(image: PixelImage) {
        this.image = image;
    }

    // TODO: now uses palette of first color map only
    private getColorMap(imageData: ImageDataInterface, targetPixelImage: PixelImage): ColorMap {
        const
            w: number = imageData.width,
            h: number = imageData.height,
            unrestrictedImage: PixelImage = new PixelImage(w, h, targetPixelImage.pWidth, targetPixelImage.pHeight),
            palette = targetPixelImage.colorMaps[0].palette;
        unrestrictedImage.colorMaps.push(new ColorMap(w, h, palette, 1, 1));
        unrestrictedImage.mappingWeight = targetPixelImage.mappingWeight;
        ImageData.drawImageData(imageData, unrestrictedImage);
        return unrestrictedImage.colorMaps[0];
    }

    /**
      Get the color that is most present in an area of the colormap.
    **/
    private reduceToMax(colorMap: ColorMap, x: number, y: number, w: number, h: number): number {
        let weights: number[] = [],
            maxWeight: number,
            maxColor: number;

        for (let ix: number = x; ix < x + w; ix += 1) {
            for (let iy: number = y; iy < y + h; iy += 1) {
                let colorIndex: number = colorMap.get(ix, iy);
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
        const
            rx: number = toColorMap.resX,
            ry: number = toColorMap.resY;

        for (let x: number = 0; x < toColorMap.width; x += rx) {
            for (let y: number = 0; y < toColorMap.height; y += ry) {
                toColorMap.put(x, y, this.reduceToMax(fromColorMap, x, y, rx, ry));
            }
        }
        fromColorMap.subtract(toColorMap);
    }

    /**
     * Create optimal ColorMaps according to ImageData
     * @param {ImageDataInterface} imageData [description]
     */
    optimizeColorMaps(imageData: ImageDataInterface): void {
        const colorMap: ColorMap = this.getColorMap(imageData, this.image);
        // fill up the colormaps in the restricted image based on the colors in the unrestricted image
        for (let ci: number = 0; ci < this.image.colorMaps.length; ci += 1) {
            this.extractColorMap(colorMap, this.image.colorMaps[ci]);
        }
    }

    /**
     * Map ImageData on the PixelImage
     * @param  {ImageDataInterface} imageData The ImageData to map
     */
    drawImageData(imageData: ImageDataInterface): void {
        for (let y: number = 0; y < this.image.height; y += 1) {
            for (let x: number = 0; x < this.image.width; x += 1) {
                let pixel: number[] = ImageData.peek(imageData, x, y);
                this.image.poke(x, y, pixel);
            }
        }
    }

}
