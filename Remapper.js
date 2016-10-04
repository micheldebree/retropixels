  var PixelImage = require('./PixelImage');
  var ColorMap = require('./ColorMap');

  function Remapper(targetPixelImage) {
      this.targetPixelImage = targetPixelImage;
  }

  /**
  Convert ImageData to a ColorMap, using the same properties as the target image.
  */
  Remapper.prototype.getColorMap = function(imageData) {
      'use strict';
      var w = imageData.width,
          h = imageData.height,
          unrestrictedImage = PixelImage.create(w, h, new ColorMap(w, h, 1, 1), this.targetPixelImage.pWidth, this.targetPixelImage.pHeight);

      unrestrictedImage.palette = this.targetPixelImage.palette;
      unrestrictedImage.dither = this.targetPixelImage.dither;
      unrestrictedImage.mappingWeight = this.targetPixelImage.mappingWeight;
      unrestrictedImage.errorDiffusionDither = this.targetPixelImage.errorDiffusionDither;
      unrestrictedImage.drawImageData(imageData);
      return unrestrictedImage.colorMaps[0];
  };

  /**
  Map ImageData onto the target image.
  */
  Remapper.prototype.mapImageData = function(imageData) {
      'use strict';

      var ci,
          colorMap = this.getColorMap(imageData);

      // fill up the colormaps in the restricted image based on the colors in the unrestricted image
      for (ci = 0; ci < this.targetPixelImage.colorMaps.length; ci += 1) {
          colorMap.extractColorMap(this.targetPixelImage.colorMaps[ci]);
      }

      // draw the image again in the restricted image
      this.targetPixelImage.drawImageData(imageData);
  };

module.exports = Remapper;
