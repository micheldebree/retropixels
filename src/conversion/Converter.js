/* jshint esversion: 6 */
const graphicModes = require('../profiles/GraphicModes.js'),
      remapper = require('./Remapper.js'),
      ImageData = require('../model/ImageData');

class Converter {

    constructor() {
        this.graphicMode = graphicModes.c64Multicolor;
    }
    
    convert(imageData) {
        const pixelImage = this.graphicMode.create();
        remapper.optimizeColorMaps(imageData, pixelImage);
        ImageData.drawImageData(imageData, pixelImage);
        return pixelImage;
    }
}

module.exports = Converter;
