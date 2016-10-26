 /*global PixelImage, ColorMap */
 /* Remaps ImageData to a PixelImage
  */
 var Remapper = {};

 Remapper.mapImageData = function (imageData, targetPixelImage) {
     'use strict';
     var ci,
         w = imageData.width,
         h = imageData.height,
         unrestrictedImage = PixelImage.create(w, h, new ColorMap(w, h, 1, 1), targetPixelImage.pWidth, targetPixelImage.pHeight);

     unrestrictedImage.palette = targetPixelImage.palette;
     unrestrictedImage.dither = targetPixelImage.dither;
     unrestrictedImage.mappingWeight = targetPixelImage.mappingWeight;
     unrestrictedImage.errorDiffusionDither = targetPixelImage.errorDiffusionDither;
     unrestrictedImage.drawImageData(imageData);
     var colorMap = unrestrictedImage.colorMaps[0];

     // fill up the colormaps in the restricted image based on the colors in the unrestricted image
     for (ci = 0; ci < targetPixelImage.colorMaps.length; ci += 1) {
         colorMap.extractColorMap(targetPixelImage.colorMaps[ci]);
     }

     // draw the image again in the restricted image
     targetPixelImage.drawImageData(imageData);
 };
