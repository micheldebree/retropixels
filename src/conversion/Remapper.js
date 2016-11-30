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

function optimizeColorMaps(imageData, targetPixelImage) {
    'use strict';
    var ci,
        colorMap = getColorMap(imageData, targetPixelImage);

    // fill up the colormaps in the restricted image based on the colors in the unrestricted image
    for (ci = 0; ci < targetPixelImage.colorMaps.length; ci += 1) {
        colorMap.extractColorMap(targetPixelImage.colorMaps[ci]);
    }
}

module.exports = {
  optimizeColorMaps : optimizeColorMaps
};
