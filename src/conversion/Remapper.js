/* jshint esversion: 6 */
/**
 * Create optimal colormaps for ImageData.
 */
const PixelImage = require('../model/PixelImage'),
      ColorMap = require('../model/ColorMap'),
      ImageData = require('../model/ImageData');

function getColorMap(imageData, targetPixelImage) {
    const w = imageData.width,
          h = imageData.height,
          unrestrictedImage = new PixelImage(w, h, targetPixelImage.pWidth, targetPixelImage.pHeight);
    unrestrictedImage.colorMaps.push(new ColorMap(w, h, 1, 1));
    unrestrictedImage.palette = targetPixelImage.palette;
    unrestrictedImage.dither = targetPixelImage.dither;
    unrestrictedImage.mappingWeight = targetPixelImage.mappingWeight;
    unrestrictedImage.errorDiffusionDither = targetPixelImage.errorDiffusionDither;
    ImageData.drawImageData(imageData, unrestrictedImage);
    return unrestrictedImage.colorMaps[0];
}

/**
  Get the color that is most present in an area of the colormap.
**/
function reduceToMax(colorMap, x, y, w, h) {
    let weights = [],
        maxWeight,
        maxColor;

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
function extractColorMap (fromColorMap, toColorMap) {
    const rx = toColorMap.resX,
          ry = toColorMap.resY;
        
    for (let x = 0; x < toColorMap.width; x += rx) {
        for (let y = 0; y < toColorMap.height; y += ry) {
            toColorMap.put(x, y, reduceToMax(fromColorMap, x, y, rx, ry));
        }
    }
    fromColorMap.subtract(toColorMap);
}

function optimizeColorMaps(imageData, targetPixelImage) {
    const colorMap = getColorMap(imageData, targetPixelImage);
    // fill up the colormaps in the restricted image based on the colors in the unrestricted image
    for (let ci = 0; ci < targetPixelImage.colorMaps.length; ci += 1) {
        extractColorMap(colorMap, targetPixelImage.colorMaps[ci]);
    }
}

module.exports = {
  optimizeColorMaps : optimizeColorMaps
};
