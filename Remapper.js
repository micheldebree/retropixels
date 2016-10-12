  var PixelImage = require('./PixelImage');
  var ColorMap = require('./ColorMap');

  function getColorMap(imageData, targetPixelImage) {
      'use strict';
      var w = imageData.width,
          h = imageData.height,
          unrestrictedImage = PixelImage.create(w, h, new ColorMap(w, h, 1, 1), targetPixelImage.pWidth, targetPixelImage.pHeight);
      unrestrictedImage.palette = targetPixelImage.palette;
      unrestrictedImage.dither = targetPixelImage.dither;
      unrestrictedImage.mappingWeight = targetPixelImage.mappingWeight;
      unrestrictedImage.errorDiffusionDither = targetPixelImage.errorDiffusionDither;
      unrestrictedImage.drawImageData(imageData);
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
