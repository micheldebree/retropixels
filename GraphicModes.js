var PixelImage = require('./PixelImage.js'),
    ColorMap = require('./ColorMap.js');
    Palette = require('./Palette.js');

c64Multicolor = function() {
    'use strict';
    var pixelImage = PixelImage.create(160, 200, undefined, 2, 1);
    pixelImage.palette = Palette.peptoPalette;
    pixelImage.colorMaps.push(new ColorMap(160, 200));
    pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
    pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
    pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
    return pixelImage;
};

c64FLI = function() {
    'use strict';
    var pixelImage = PixelImage.create(160, 200, undefined, 2, 1);
    pixelImage.palette = Palette.peptoPalette;
    pixelImage.colorMaps.push(new ColorMap(160, 200));
    pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
    pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 1));
    pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 1));
    return pixelImage;
};

c64AFLI = function() {
    'use strict';
    var pixelImage = PixelImage.create(320, 200, undefined, 1, 1);
    pixelImage.palette = Palette.peptoPalette;
    pixelImage.colorMaps.push(new ColorMap(320, 200, 8, 8));
    pixelImage.colorMaps.push(new ColorMap(320, 200, 8, 1));
    return pixelImage;
};

c64Hires = function() {
    'use strict';
    var pixelImage = PixelImage.create(320, 200, undefined, 1, 1);
    pixelImage.palette = Palette.peptoPalette;
    pixelImage.colorMaps.push(new ColorMap(320, 200, 8, 8));
    pixelImage.colorMaps.push(new ColorMap(320, 200, 8, 8));
    return pixelImage;
};

module.exports = {
    c64Multicolor: c64Multicolor,
    c64FLI: c64FLI,
    c64AFLI: c64AFLI,
    c64Hires: c64Hires
};
