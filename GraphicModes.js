var PixelImage = require('./PixelImage.js'),
    ColorMap = require('./ColorMap.js'),
    Palette = require('./Palette.js');

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

c64Unlimited = {
    create: function() {
        var pixelImage = PixelImage.create(320, 200, 1, 1);
        pixelImage.palette = peptoPalette;
        pixelImage.colorMaps.push(new ColorMap(320, 200, 1, 1));
        return pixelImage;
    }
};

c64Multicolor = {
    create: function() {
        var pixelImage = PixelImage.create(160, 200, 2, 1);
        pixelImage.palette = peptoPalette;
        pixelImage.colorMaps.push(new ColorMap(160, 200));
        pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
        pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
        pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
        return pixelImage;
    }
};

c64FLI = {
    create: function() {
        var pixelImage = PixelImage.create(160, 200, 2, 1);
        pixelImage.palette = peptoPalette;
        pixelImage.colorMaps.push(new ColorMap(160, 200));
        pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
        pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 1));
        pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 1));
        return pixelImage;
    }
};

c64AFLI = {
    create: function() {
        var pixelImage = PixelImage.create(320, 200, 1, 1);
        pixelImage.palette = peptoPalette;
        pixelImage.colorMaps.push(new ColorMap(320, 200, 8, 8));
        pixelImage.colorMaps.push(new ColorMap(320, 200, 8, 1));
        return pixelImage;
    }
};

c64Hires = {
    create: function() {
        var pixelImage = PixelImage.create(320, 200, 1, 1);
        pixelImage.palette = peptoPalette;
        pixelImage.colorMaps.push(new ColorMap(320, 200, 8, 8));
        pixelImage.colorMaps.push(new ColorMap(320, 200, 8, 8));
        return pixelImage;
    }
};

module.exports = {
    c64Unlimited: c64Unlimited,
    c64Multicolor: c64Multicolor,
    c64FLI: c64FLI,
    c64AFLI: c64AFLI,
    c64Hires: c64Hires
};
