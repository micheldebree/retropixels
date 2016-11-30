var graphicModes = require('./GraphicModes.js'),
    orderedDitherers = require('./OrderedDitherers.js'),
    remapper = require('./Remapper.js');

function Converter() {
    'use strict';
    this.graphicMode = graphicModes.c64Multicolor;
    this.dither = orderedDitherers.bayer4x4;
    this.convert = function(imageData) {
        var pixelImage = this.graphicMode.create();
        pixelImage.dither = this.dither;
        remapper.optimizeColorMaps(imageData, pixelImage);
        pixelImage.drawImageData(imageData);
        return pixelImage;
    };
}

module.exports = Converter;
