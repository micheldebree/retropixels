var graphicModes = require('../profiles/GraphicModes.js'),
    orderedDitherers = require('../profiles/OrderedDitherers.js'),
    remapper = require('./Remapper.js'),
    ImageData = require('../model/ImageData');

function Converter() {
    'use strict';
    this.graphicMode = graphicModes.c64Multicolor;
    this.dither = orderedDitherers.bayer4x4;
    this.convert = function(imageData) {
        var pixelImage = this.graphicMode.create();
        pixelImage.dither = this.dither;
        remapper.optimizeColorMaps(imageData, pixelImage);
        ImageData.drawImageData(imageData, pixelImage);
        return pixelImage;
    };
}

module.exports = Converter;
