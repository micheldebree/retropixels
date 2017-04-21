/**
 * Create optimal colormaps for ImageData.
 * TODO: does not support different palettes per colorMap
 * TODO: rename 
 */
import {PixelImage} from '../model/PixelImage';
import {ColorMap} from '../model/ColorMap';
import * as ImageData from '../model/ImageData';
import {ImageDataInterface} from '../model/ImageDataInterface';

// TODO: now uses palette of first color map only
function getColorMap(imageData: ImageDataInterface, targetPixelImage: PixelImage): ColorMap {
    const w: number = imageData.width,
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
function reduceToMax(colorMap: ColorMap, x: number, y: number, w: number, h: number): number {
    let weights: number[] = [],
        maxWeight: number,
        maxColor: number;

    for (let ix = x; ix < x + w; ix += 1) {
        for (let iy = y; iy < y + h; iy += 1) {
            let color = colorMap.get(ix, iy);
            if (color !== undefined) {
                weights[color] = weights[color] === undefined ? 1 : weights[color] + 1;
                if (maxWeight === undefined || weights[color] > maxWeight) {
                    maxWeight = weights[color];
                    maxColor = color;
                }
            }
        }
    }
    return maxColor;
}

/**
 * Delete colors from one colorMap and put them in another.
 */
function extractColorMap (fromColorMap: ColorMap, toColorMap: ColorMap): void {
    const rx = toColorMap.resX,
          ry = toColorMap.resY;
        
    for (let x = 0; x < toColorMap.width; x += rx) {
        for (let y = 0; y < toColorMap.height; y += ry) {
            toColorMap.put(x, y, reduceToMax(fromColorMap, x, y, rx, ry));
        }
    }
    fromColorMap.subtract(toColorMap);
}
// }}}

export function optimizeColorMaps(imageData: ImageDataInterface, targetPixelImage: PixelImage): void {
    const colorMap = getColorMap(imageData, targetPixelImage);
    // fill up the colormaps in the restricted image based on the colors in the unrestricted image
    for (let ci = 0; ci < targetPixelImage.colorMaps.length; ci += 1) {
        extractColorMap(colorMap, targetPixelImage.colorMaps[ci]);
    }
}


