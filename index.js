#!/usr/bin/env node

/* jshint esversion: 6 */
const cli = require('commander'),
    fs = require('fs-extra'),
    path = require('path'),
    jimp = require('jimp'),
    GraphicModes = require('./target/profiles/GraphicModes.js'),
    KoalaPicture = require('./target/io/KoalaPicture.js'),
    HiresPicture = require('./target/io/HiresPicture.js'),
    FLIPicture = require('./target/io/FLIPicture.js'),
    AFLIPicture = require('./target/io/AFLIPicture.js'),
    PNGPicture = require('./target/io/PNGPicture.js'),
    Converter = require('./target/conversion/Converter.js'),
    ImageData = require('./target/model/ImageData.js'),
    BayerMatrix = require('./target/conversion/BayerMatrix.js'),
    C64Mapper = require('./target/io/C64Mapper.js');

const c64BinariesFolder = '/target/c64';

// defaults
let graphicMode = GraphicModes.all.c64Multicolor;
let ditherMode = 'bayer4x4';
let ditherRadius = 32;

cli.version('0.5.3')
    .usage('[options] <infile> <outfile>')
    .option('-m, --mode <graphicMode>', 'c64Multicolor (default), c64Hires, c64HiresMono, c64FLI, c64AFLI')
    .option('-d, --ditherMode <ditherMode>', 'bayer2x2, bayer4x4 (default), bayer8x8')
    .option('-r, --ditherRadius [0-64]', '0 = no dithering, 32 = default', parseInt)
    .parse(process.argv);

if (!cli.mode) {
    cli.mode = 'c64Multicolor';
}

if (cli.mode in GraphicModes.all) {
    console.log('Using graphicMode ' + cli.mode);
    graphicMode = GraphicModes.all[cli.mode];
} else {
    console.error('Unknown Graphicmode: ' + cli.mode);
    cli.help();
    process.exit(1);
}

if (cli.ditherRadius !== undefined) {
    ditherRadius = cli.ditherRadius;
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
        return saveExecutable(KoalaPicture.KoalaPicture.fromPixelImage(pixelImage), 'KoalaShower.prg');
    }

    if (cli.mode === 'c64FLI') {
        return saveExecutable(FLIPicture.FLIPicture.fromPixelImage(pixelImage), 'FLIShower.prg');
    }

    if (cli.mode === 'c64AFLI') {
        return saveExecutable(AFLIPicture.AFLIPicture.fromPixelImage(pixelImage), 'AFLIShower.prg');
    }

    if (cli.mode == 'c64Hires' || cli.mode == 'c64HiresMono') {
        return saveExecutable(HiresPicture.HiresPicture.fromPixelImage(pixelImage), 'HiresShower.prg');
    }

    throw 'Commodore 64 executable format is not supported for mode ' + cli.mode + '.';
}

function saveExecutable(nativeImage, viewerFilename) {
    const mapper = new C64Mapper.C64Mapper();
    mapper.viewerFilename = viewerFilename;
    mapper.saveExecutable(nativeImage.toMemoryMap(), outFile, () => {
        console.log('Written Commodore 64 executable ' + outFile);
    });
}

// Save PixelImage as a KoalaPaint image.
function saveKoala(pixelImage) {
    const koalaImage = KoalaPicture.KoalaPicture.fromPixelImage(pixelImage);
    koalaImage.save(outFile, function (err) {
        if (err) throw err;
        console.log('Written Koala Painter file ' + outFile);
    });
}

// Save PixelImage as a PNG image.
function savePng(pixelImage, filename) {
    new jimp(pixelImage.width, pixelImage.height, function (err, image) {
        if (err) throw err;
        for (let y = 0; y < image.bitmap.height; y += 1) {
            for (let x = 0; x < image.bitmap.width; x += 1) {
                ImageData.ImageData.poke(image.bitmap, x, y, pixelImage.peek(x, y));
            }
        }
        image.resize(pixelImage.width * pixelImage.pWidth, pixelImage.height * pixelImage.pHeight);
        image.write(filename, function () {
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

        // Show FLI bug by clearing first 12 pixels on each row.
        if (cli.mode === 'c64FLI') {
            for (y = 0; y < pixelImage.height; y++) {
                for (x = 0; x < 12; x++) {
                    pixelImage.pixelIndex[y][x] = 0;
                }
            }
        }

        outExtension = path.extname(outFile);

        if ('.kla' === outExtension) {
            saveKoala(pixelImage);
        } else if ('.prg' === outExtension) {
            savePrg(pixelImage);
        } else if ('.png' === outExtension) {
            savePng(pixelImage, outFile);
        } else {
            throw 'Unknown file extension ' + outExtension + ', valid extensions are .png, .kla and .prg';
        }
    } catch (e) {
        console.error(e);
        cli.help();
        process.exit(1);
    }
});

// }}}
