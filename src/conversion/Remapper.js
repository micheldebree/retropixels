/**
 * Create optimal colormaps for ImageData.
 */
var PixelImage = require('../model/PixelImage'),
    ColorMap = require('../model/ColorMap'),
    ImageData = require('../model/ImageData');

function getColorMap(imageData, targetPixelImage) {
    'use strict';
    var w = imageData.width,
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
    'use strict';
    var weights = [],
        ix,
        iy,
        color,
        maxWeight,
        maxColor;

    for (ix = x; ix < x + w; ix += 1) {
        for (iy = y; iy < y + h; iy += 1) {
            color = colorMap.getColor(ix, iy);
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
    'use strict';
    var x,
        y,
        rx = toColorMap.resX,
        ry = toColorMap.resY;
        
    for (x = 0; x < toColorMap.width; x += rx) {
        for (y = 0; y < toColorMap.height; y += ry) {
            toColorMap.add(x, y, reduceToMax(fromColorMap, x, y, rx, ry));
        }
    }
    fromColorMap.subtract(toColorMap);
}

function optimizeColorMaps(imageData, targetPixelImage) {
    'use strict';
    var ci,
        colorMap = getColorMap(imageData, targetPixelImage);
    // fill up the colormaps in the restricted image based on the colors in the unrestricted image
    for (ci = 0; ci < targetPixelImage.colorMaps.length; ci += 1) {
        extractColorMap(colorMap, targetPixelImage.colorMaps[ci]);
    }
}

module.exports = {
  optimizeColorMaps : optimizeColorMaps
};
