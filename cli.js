#!/usr/bin/env node
/* jshint esversion: 6 */
const cli = require('commander'),
  path = require('path'),
  jimp = require('jimp'),
  retropixels = require('.'),
  version = require('./package').version;

// defaults
let graphicMode = retropixels.GraphicModes.c64Multicolor;
let ditherMode = 'bayer4x4';
let ditherRadius = 32;

cli
  .version(version)
  .usage('[options] <infile> <outfile>')
  .option('-m, --mode <graphicMode>', 'c64Multicolor (default), c64Hires, c64HiresMono, c64FLI, c64AFLI')
  .option('-d, --ditherMode <ditherMode>', 'bayer2x2, bayer4x4 (default), bayer8x8')
  .option('-r, --ditherRadius [0-64]', '0 = no dithering, 32 = default', parseInt)
  .option('--unicorn', 'Only for unicorns')
  .parse(process.argv);

if (!cli.mode) {
  cli.mode = 'c64Multicolor';
}

if (cli.mode in retropixels.GraphicModes.all) {
  console.log(`Using graphicMode ${cli.mode}`);
  graphicMode = retropixels.GraphicModes.all[cli.mode];
} else {
  console.error(`Unknown graphicmode: ${cli.mode}`);
  cli.help();
  process.exit(1);
}

if (cli.ditherRadius !== undefined) {
  ditherRadius = cli.ditherRadius;
}

if (cli.ditherMode !== undefined) {
  ditherMode = cli.ditherMode;
}

const ditherPreset = retropixels.OrderedDither.presets[ditherMode];
if (!ditherPreset) {
  console.error(`Unknown ditherMode: ${ditherMode}`);
  cli.help();
}
const ditherer = new retropixels.OrderedDither(ditherPreset, ditherRadius);

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

// Save PixelImage as a PNG image.
function savePng(pixelImage, filename) {
  new jimp(pixelImage.mode.width, pixelImage.mode.height, function (err, image) {
    if (err) throw err;
    retropixels.JimpPreprocessor.write(pixelImage, image, filename);
  });
}

function saveDebugMaps(pixelImage) {
  var mapimages = pixelImage.debugColorMaps();
  var i = 0;
  for (var mapimage of mapimages) {
    savePng(mapimage, outFile + '-map' + i++ + '.png');
  }
}

const converter = new retropixels.Converter();

if (cli.unicorn) {
  converter.poker.quantizer.colorspace = retropixels.Quantizer.colorspaces.Unicorn;
}

const pixelImage = graphicMode.builder(retropixels.Palettes.pepto);

retropixels.JimpPreprocessor.read(inFile, pixelImage.mode).then(jimpImage => {
  try {

    ditherer.dither(jimpImage);

    converter.convert(jimpImage, pixelImage);

    outExtension = path.extname(outFile);

    if ('.kla' === outExtension || '.spd' === outExtension) {
      retropixels.C64Writer.saveBinary(pixelImage, outFile).then(console.log(`Written ${outFile}`));
    } else if ('.prg' === outExtension) {
      retropixels.C64Writer.savePrg(pixelImage, outFile).then(console.log(`Written ${outFile}`));
    } else if ('.png' === outExtension) {
      savePng(pixelImage, outFile);
    } else {
      throw `Unknown file extension ${outExtension}, valid extensions are .png, .kla and .prg`;
    }
  } catch (e) {
    console.error(e);
    cli.help();
    process.exit(1);
  }
});
