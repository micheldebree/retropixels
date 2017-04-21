// const 
// cli = require('commander'),
// fs = require('fs-extra'),
// path = require('path'),
// jimp = require("jimp"),
// graphicModes = require('./src/profiles/GraphicModes.js'),
// Pixels = require('./src/model/Pixels.js'),


import * as cli from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as jimp from 'jimp';

import * as graphicModes from './src/profiles/GraphicModes.js';
import * as Pixels from './src/model/Pixels.js';
import * as koala from './src/io/KoalaPicture.js';
import * as Converter from './src/conversion/Converter.js';
import * as ImageData from './src/model/ImageData.js';

const graphicMode = graphicModes.c64Multicolor;

cli.version('0.1.0')
    .usage('[options] <infile> <outfile>')
    .parse(process.argv);

const inFile = cli.args[0],
    outFile = cli.args[1];

if (inFile === undefined) {
    console.error("Input file missing.");
    cli.help();
}

if (outFile === undefined) {
    console.error("Output file missing.");
    cli.help();
}

// Save PixelImage as a c64 native .PRG executable.
function savePrg(pixelImage) {
    const koalaImage = koala.fromPixelImage(pixelImage),
        binary = path.join(__dirname, '/src/c64/KoalaShower.prg');

    fs.readFile(binary, function (err, viewerCode) {
        if (err) throw err;
        const koalaBuffer = new Buffer(koalaImage.toBytes()),
            writeBuffer = Buffer.concat([viewerCode, koalaBuffer]);
        fs.writeFile(outFile, writeBuffer, function (err) {
            if (err) throw err;
            console.log('Written Commodore 64 executable ' + outFile);
        });
    });
}

// Save PixelImage as a KoalaPaint image.
function saveKoala(pixelImage) {
    const koalaImage = koala.fromPixelImage(pixelImage);
    fs.writeFile(outFile, new Buffer(koalaImage.toBytes()), function (err) {
        if (err) throw err;
        console.log('Written Koala Painter file ' + outFile);
    });
}

// Save PixelImage as a PNG image.
function savePng(pixelImage) {
    new jimp(pixelImage.width, pixelImage.height, function (err, image) {
        if (err) throw err;
        for (let y = 0; y < image.bitmap.height; y += 1) {
            for (let x = 0; x < image.bitmap.width; x += 1) {
                ImageData.poke(image.bitmap, x, y, pixelImage.peek(x, y));
            }
        }
        image.resize(pixelImage.width * pixelImage.pWidth, pixelImage.height * pixelImage.pHeight);
        image.write(outFile, function () {
            console.log('Written PNG image ' + outFile);
        });
    });
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
    if (err) throw err;

    cropFill(jimpImage, graphicMode.width * graphicMode.pixelWidth, graphicMode.height * graphicMode.pixelHeight);
    jimpImage.resize(graphicMode.width, graphicMode.height);

    const converter = new Converter();
    converter.graphicMode = graphicMode;
    const pixelImage = converter.convert(jimpImage.bitmap);

    const outExtension = path.extname(outFile);

    if ('.kla' === outExtension) {
        saveKoala(pixelImage);
    } else if ('.prg' === outExtension) {
        savePrg(pixelImage);
    } else if ('.png' === outExtension) {
        savePng(pixelImage);
    } else {
        console.error('Unknown file extension ' + outExtension + ', valid extensions are .png, .kla and .prg');
    }

});

// }}}
