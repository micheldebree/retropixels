var PixelImage = require('../model/PixelImage.js'),
    ColorMap = require('../model/ColorMap.js'),
    Palette = require('../model/Palette.js');

peptoPalette = new Palette([
    [0, 0, 0, 0xff], // black
    [0xff, 0xff, 0xff, 0xff], // white
    [0x68, 0x37, 0x2b, 0xff], //red
    [0x70, 0xa4, 0xb2, 0xff], //cyan
    [0x6f, 0x3d, 0x86, 0xff], //purple
    [0x58, 0x8d, 0x43, 0xff], //green
    [0x35, 0x28, 0x79, 0xff], //blue
    [0xb8, 0xc7, 0x6f, 0xff], //yellow
    [0x6f, 0x4f, 0x25, 0xff], //orange
    [0x43, 0x39, 0x00, 0xff], //brown
    [0x9a, 0x67, 0x59, 0xff], //light red
    [0x44, 0x44, 0x44, 0xff], //dark gray
    [0x6c, 0x6c, 0x6c, 0xff], //medium gray
    [0x9a, 0xd2, 0x84, 0xff], //light green
    [0x6c, 0x5e, 0xb5, 0xff], //light blue
    [0x95, 0x95, 0x95, 0xff] //green
]);

spectrumPallete = new Palette([
    [0, 0, 0, 0xff], // black
    [0, 0, 0xd7], // blue
    [0xd7, 0, 0], // red
    [0xd7, 0, 0xd7], //magenta
    [0, 0xd7, 0], //green
    [0, 0xd7, 0xd7], //green
    [0xd7, 0xd7, 0], // yellow
    [0xd7, 0xd7, 0xd7], // gray
    [0, 0, 0xff], // blue
    [0xff, 0, 0], // red
    [0xff, 0, 0xff], //magenta
    [0, 0xff, 0], //green
    [0, 0xff, 0xff], //green
    [0xff, 0xff, 0], // yellow
    [0xff, 0xff, 0xff] // gray
]);

pysslaPalette2 = new Palette([
  [0xeb, 0xae, 0x36]
]);

pysslaPalette1 = new Palette([
    [0xbd, 0x10, 0x2c], // red
    [0x15, 0x62, 0xae], // blue
    [0x8e, 0x75, 0xc0], // purple
    [0xf3, 0x35, 0xb7], // pink
    [0xd3, 0xd3, 0xd3], // white
    [0x06, 0x4b, 0x21], // green
    [0xe6, 0xa7, 0x21], // yellow
    [0x27, 0x1b, 0x25], // brown
    [0xda, 0x2a, 0x2a], // orange
    [0x13, 0x13, 0x13]  // black
]);

// C64 resolution and palette, but no attribute restrictions (not supported on real c64)
c64Unlimited = {
    width: 320,
    height: 200,
    pixelWidth: 1,
    pixelHeight: 1,
    create: function() {
        var pixelImage = new PixelImage(320, 200);
        pixelImage.colorMaps.push(new ColorMap(320, 200, peptoPalette, 1, 1));
        return pixelImage;
    }
};

// C64 standard multicolor mode
c64Multicolor = {
    width: 160,
    height: 200,
    pixelWidth: 2,
    pixelHeight: 1,
    create: function() {
        var pixelImage = new PixelImage(160, 200, 2, 1);
        pixelImage.colorMaps.push(new ColorMap(160, 200, peptoPalette, 160, 200));
        pixelImage.colorMaps.push(new ColorMap(160, 200, peptoPalette, 4, 8));
        pixelImage.colorMaps.push(new ColorMap(160, 200, peptoPalette, 4, 8));
        pixelImage.colorMaps.push(new ColorMap(160, 200, peptoPalette, 4, 8));
        return pixelImage;
    }
};

// C64 standard high resolution mode
c64Hires = {
    width: 320,
    height: 200,
    pixelWidth: 1,
    pixelHeight: 1,
    create: function() {
        var pixelImage = new PixelImage(320, 200);
        pixelImage.colorMaps.push(new ColorMap(320, 200, peptoPalette, 8, 8));
        pixelImage.colorMaps.push(new ColorMap(320, 200, peptoPalette, 8, 8));
        return pixelImage;
    }
};

// C64 FLI mode
c64FLI = {
    width: 160,
    height: 200,
    pixelWidth: 2,
    pixelHeight: 1,
    create: function() {
        var pixelImage = new PixelImage(160, 200, 2, 1);
        pixelImage.colorMaps.push(new ColorMap(160, 200, peptoPalette));
        pixelImage.colorMaps.push(new ColorMap(160, 200, peptoPalette, 4, 8));
        pixelImage.colorMaps.push(new ColorMap(160, 200, peptoPalette, 4, 1));
        pixelImage.colorMaps.push(new ColorMap(160, 200, peptoPalette, 4, 1));
        return pixelImage;
    }
};

// C64 AFLI mode
c64AFLI = {
    width: 320,
    height: 200,
    pixelWidth: 1,
    pixelHeight: 1,
    create: function() {
        var pixelImage = new PixelImage(320, 200);
        pixelImage.colorMaps.push(new ColorMap(320, 200, peptoPalette, 8, 8));
        pixelImage.colorMaps.push(new ColorMap(320, 200, peptoPalette, 8, 1));
        return pixelImage;
    }
};

spectrumStandard = {
    create: function() {
        var pixelImage = new PixelImage(256, 192);
        pixelImage.colorMaps.push(new ColorMap(256, 192, spectrumPallete, 8, 8));
        pixelImage.colorMaps.push(new ColorMap(256, 192, spectrumPallete, 8, 8));
        return pixelImage;
    }
};

pyssla = {
  width: 40,
  height: 40,
  pixelWidth: 1,
  pixelHeight: 1,
  create: function() {
    var pixelImage = new PixelImage(40, 40);
    pixelImage.colorMaps.push(new ColorMap(40, 40, pysslaPalette1, 1, 1));
    return pixelImage;
  }
};

module.exports = {
    c64Unlimited: c64Unlimited,
    c64Multicolor: c64Multicolor,
    c64FLI: c64FLI,
    c64AFLI: c64AFLI,
    c64Hires: c64Hires,
    spectrumStandard: spectrumStandard,
    pyssla: pyssla
};
