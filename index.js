#!/usr/bin/env node

/* jshint esversion: 6 */
const cli = require('commander'),
    fs = require('fs-extra'),
    path = require('path'),
    jimp = require('jimp'),
    GraphicModes = require('./target/profiles/GraphicModes.js'),
    KoalaPicture = require('./target/io/KoalaPicture.js'),
    FLIPicture = require('./target/io/FLIPicture.js'),
    PNGPicture = require('./target/io/PNGPicture.js'),
    Converter = require('./target/conversion/Converter.js'),
    ImageData = require('./target/model/ImageData.js'),
    BayerMatrix = require('./target/conversion/BayerMatrix.js');

const c64BinariesFolder = '/target/c64';

// defaults
let graphicMode = GraphicModes.all['c64Multicolor'];
let ditherMode = 'bayer4x4';
let ditherRadius = 32;

cli.version('0.3.1')
    .usage('[options] <infile> <outfile>')
    .option('-m, --mode <graphicMode>', 'c64Multicolor (default), c64Hires, c64HiresMono, c64FLI, c64AFLI')
    .option('-d, --ditherMode <ditherMode>', 'bayer2x2, bayer4x4 (default), bayer8x8')
    .option('-r, --ditherRadius [0-64]', '0 = no dithering, 32 = default', parseInt)
    .parse(process.argv);

// TODO: get rid of double bookkeeping (graphicMode and cli.mode)
if (cli.mode) {
    if (cli.mode in GraphicModes.all) {
        console.log('Using graphicMode ' + cli.mode);
        graphicMode = GraphicModes.all[cli.mode];
    }
    else {
        console.error('Unknown Graphicmode: ' + cli.mode);
        cli.help();
        process.exit(1);
    }
}
else {
    cli.mode = 'c64Multicolor';
}

if (cli.ditherRadius !== undefined) {
    ditherRadius = cli.ditherRadius;
    console.log(ditherRadius);
}

if (cli.ditherMode !== undefined) {
    ditherMode = cli.ditherMode;
}

const inFile = cli.args[0],
    outFile = cli.args[1];

if (inFile === undefined) {
    console.error('Input file missing.');
    cli.help();
}

if (outFile === undefined) {
    console.error('Output file missing.');
    cli.help();
}

// Save PixelImage as a c64 native .PRG executable.
function savePrg(pixelImage) {

    if (cli.mode === 'c64Multicolor') {
        saveKoalaPrg(pixelImage);
        return;
    }

    if (cli.mode === 'c64FLI') {
        saveFLIPrg(pixelImage);
        return;
    }

    throw 'Commodore 64 executable format is not supported for mode ' + cli.mode + '.';
}

// Save PixelImage as a c64 native .PRG executable.
function saveKoalaPrg(pixelImage) {

    const koalaImage = KoalaPicture.KoalaPicture.fromPixelImage(pixelImage),
        binary = path.join(__dirname, c64BinariesFolder + '/KoalaShower.prg');

    fs.readFile(binary, function(err, viewerCode) {
        if (err) throw err;
        const koalaBuffer = new Buffer(koalaImage.toBytes()),
            writeBuffer = Buffer.concat([viewerCode, koalaBuffer]);
        fs.writeFile(outFile, writeBuffer, function(err) {
            if (err) throw err;
            console.log('Written Commodore 64 executable ' + outFile);
        });
    });
}

// Save PixelImage as a c64 native .PRG executable.
function saveFLIPrg(pixelImage) {

    const fliImage = FLIPicture.FLIPicture.fromPixelImage(pixelImage),
        binary = path.join(__dirname, c64BinariesFolder + '/FLIShower.prg');

    fs.readFile(binary, function(err, viewerCode) {
        if (err) throw err;
        const buffer = new Buffer(fliImage.toBytes()),
            writeBuffer = Buffer.concat([viewerCode, buffer]);
        fs.writeFile(outFile, writeBuffer, function(err) {
            if (err) throw err;
            console.log('Written Commodore 64 executable ' + outFile);
        });
    });
}



// Save PixelImage as a KoalaPaint image.
function saveKoala(pixelImage) {
    if (cli.mode !== 'c64Multicolor') {
        throw 'Koala painter format is only supported for c64Multicolor mode.';
    }
    const koalaImage = KoalaPicture.KoalaPicture.fromPixelImage(pixelImage);
    koalaImage.save(outFile, function(err) {
        if (err) throw err;
        console.log('Written Koala Painter file ' + outFile);
    });
}

// Save PixelImage as a PNG image.
function savePng(pixelImage, filename) {
    new jimp(pixelImage.width, pixelImage.height, function(err, image) {
        if (err) throw err;
        for (let y = 0; y < image.bitmap.height; y += 1) {
            for (let x = 0; x < image.bitmap.width; x += 1) {
                ImageData.ImageData.poke(image.bitmap, x, y, pixelImage.peek(x, y));
            }
        }
        image.resize(pixelImage.width * pixelImage.pWidth, pixelImage.height * pixelImage.pHeight);
        image.write(filename, function() {
            console.log('Written PNG image ' + filename);
        });
    });
}

function saveDebugMaps(pixelImage) {
    var mapimages = pixelImage.debugColorMaps();
    var i = 0;
    for (var mapimage of mapimages) {
        savePng(mapimage, outFile + '-map' + i++ + '.png');
    }
}

// Crop a JIMP Image to fill up a specific ratio. Ratio is passed as relative width and height.
function cropFill(jimpImage, relativeWidth, relativeHeight) {
    const srcWidth = jimpImage.bitmap.width,
        srcHeight = jimpImage.bitmap.height,
        destratio = relativeWidth / relativeHeight,
        srcratio = srcWidth / srcHeight,
        cropwidth = Math.round(srcratio > destratio ? srcHeight * destratio : srcWidth),
        cropheight = Math.round(srcratio > destratio ? srcHeight : srcWidth / destratio),
        sourceLeft = Math.round((srcWidth - cropwidth) / 2),
        sourceTop = Math.round((srcHeight - cropheight) / 2);
    jimpImage.crop(sourceLeft, sourceTop, cropwidth, cropheight);
}

// Main {{{

jimp.read(inFile, (err, jimpImage) => {
    try {
        if (err) throw err;

        cropFill(jimpImage, graphicMode.width * graphicMode.pixelWidth, graphicMode.height * graphicMode.pixelHeight);
        jimpImage.resize(graphicMode.width, graphicMode.height);

        // jimpImage.normalize();

        const converter = new Converter.Converter(graphicMode);
        converter.bayerMatrix = new BayerMatrix.BayerMatrix(ditherMode, ditherRadius);
        const pixelImage = converter.convert(jimpImage.bitmap);

        outExtension = path.extname(outFile);

        if ('.kla' === outExtension) {
            saveKoala(pixelImage);
        }
        else if ('.prg' === outExtension) {
            savePrg(pixelImage);
        }
        else if ('.png' === outExtension) {
            savePng(pixelImage, outFile);
            // saveDebugMaps(pixelImage);
            // PNGPicture.PNGPicture.save(pixelImage, outFile, () => {
                // log.console('Saved PNG picture ' + outFile);
            // });
        }
        else {
            throw 'Unknown file extension ' + outExtension + ', valid extensions are .png, .kla and .prg';
        }
    }
    catch (e) {
        console.error(e);
        cli.help();
        process.exit(1);
    }
});

// }}}
