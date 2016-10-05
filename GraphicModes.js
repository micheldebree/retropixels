var PixelImage = require('./PixelImage.js'),
    ColorMap = require('./ColorMap.js');

function GraphicModes() {
    'use strict';
}

GraphicModes.c64Multicolor = function() {
    'use strict';
    var pixelImage = PixelImage.create(160, 200, undefined, 2, 1);
    pixelImage.palette = peptoPalette;
    pixelImage.colorMaps.push(new ColorMap(160, 200));
    pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
    pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
    pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
    return pixelImage;
};

GraphicModes.c64FLI = function() {
    'use strict';
    var pixelImage = PixelImage.create(160, 200, undefined, 2, 1);
    pixelImage.palette = peptoPalette;
    pixelImage.colorMaps.push(new ColorMap(160, 200));
    pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
    pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 1));
    pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 1));
    return pixelImage;
};

GraphicModes.c64AFLI = function() {
    'use strict';
    var pixelImage = PixelImage.create(320, 200, undefined, 1, 1);
    pixelImage.palette = peptoPalette;
    pixelImage.colorMaps.push(new ColorMap(320, 200, 8, 8));
    pixelImage.colorMaps.push(new ColorMap(320, 200, 8, 1));
    return pixelImage;
};

GraphicModes.c64Hires = function() {
    'use strict';
    var pixelImage = PixelImage.create(320, 200, undefined, 1, 1);
    pixelImage.palette = peptoPalette;
    pixelImage.colorMaps.push(new ColorMap(320, 200, 8, 8));
    pixelImage.colorMaps.push(new ColorMap(320, 200, 8, 8));
    return pixelImage;
};

GraphicModes.all = [{
    key: 'Multicolor',
    value: GraphicModes.c64Multicolor
}, {
    key: 'FLI',
    value: GraphicModes.c64FLI
}, {
    key: 'AFLI',
    value: GraphicModes.c64AFLI
}, {
    key: 'Hires',
    value: GraphicModes.c64Hires
}];

module.exports = GraphicModes;
