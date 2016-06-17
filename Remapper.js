 /*global PixelImage, ColorMap */
function Remapper(targetPixelImage) {
    'use strict';
    this.targetPixelImage = targetPixelImage;
}
 
Remapper.prototype.getColorMap = function (imageData, image) {
    'use strict';
    var w = imageData.width,
     h = imageData.height,
     unrestrictedImage = PixelImage.create(w, h, new ColorMap(w, h, 1, 1), image.pWidth, image.pHeight);

    unrestrictedImage.palette = image.palette;
    unrestrictedImage.dither = image.dither;
    unrestrictedImage.mappingWeight = image.mappingWeight;
    unrestrictedImage.errorDiffusionDither = image.errorDiffusionDither;
    unrestrictedImage.drawImageData(imageData);
    return unrestrictedImage.colorMaps[0];
};
 
Remapper.prototype.mapImageData = function (imageData) {
    'use strict';

    var ci, 
     colorMap = this.getColorMap(imageData, this.targetPixelImage);

    // fill up the colormaps in the restricted image based on the colors in the unrestricted image
    for (ci = 0; ci < this.targetPixelImage.colorMaps.length; ci += 1) {
     colorMap.extractColorMap(this.targetPixelImage.colorMaps[ci]);
    }

    // draw the image again in the restricted image
    this.targetPixelImage.drawImageData(imageData);
 };
