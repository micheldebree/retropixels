/*jshint esversion: 6 */
var cli = require('commander'),
    fs = require('fs-extra'),
    jimp = require("jimp"),
    graphicModes = require('./GraphicModes.js'),
    pixelCalculator = require('./PixelCalculator.js'),
    orderedDitherers = require('./OrderedDitherers.js'),
    remapper = require('./Remapper.js'),
    koala = require('./KoalaPicture.js'),
    graphicMode = graphicModes.c64Multicolor,
    pixelImage = graphicMode.create();

cli.version('0.1.0')
    .usage('[options] <infile> [outfile]')
    .parse(process.argv);

var inFile = cli.args[0],
    outFile = cli.args[1];

if (inFile === undefined) {
    console.error("Input file missing.");
    cli.help();
}

if (outFile === undefined) {
    outFile = inFile + '-retro.png';
}

jimp.read(inFile, function(err, jimpImage) {
    if (err) throw err;

    jimpImage.resize(graphicMode.width, graphicMode.height);
    pixelImage.dither = orderedDitherers.bayer4x4;
    remapper.optimizeColorMaps(jimpImage.bitmap, pixelImage);
    pixelImage.drawImageData(jimpImage.bitmap);

    for (y = 0; y < jimpImage.bitmap.height; y += 1) {
        for (x = 0; x < jimpImage.bitmap.width; x += 1) {
            pixelCalculator.poke(jimpImage.bitmap, x, y, pixelImage.peek(x, y));
        }
    }

    jimpImage.resize(graphicMode.width * graphicMode.pixelWidth, graphicMode.height * graphicMode.pixelHeight);

    jimpImage.write(outFile, function() {
        console.log('Written ' + outFile);
    });

    koalaPic = koala.fromPixelImage(pixelImage);
    var koalaFile = inFile + '.kla';
    fs.writeFile(koalaFile, new Buffer(koalaPic.toBytes()), (err) => {
        if (err) throw err;
        console.log('Written ' + koalaFile);
    });

});
