/* jshint esversion: 6 */
const graphicModes = require('../profiles/GraphicModes.js'),
      orderedDitherers = require('../profiles/OrderedDitherers.js'),
      remapper = require('./Remapper.js'),
      ImageData = require('../model/ImageData');

class Converter {

    constructor() {
        this.graphicMode = graphicModes.c64Multicolor;
        this.dither = orderedDitherers.bayer4x4;
    }
    
    convert(imageData) {
        const pixelImage = this.graphicMode.create();
        pixelImage.dither = this.dither;
        remapper.optimizeColorMaps(imageData, pixelImage);
        ImageData.drawImageData(imageData, pixelImage);
        return pixelImage;
    }
}

module.exports = Converter;
