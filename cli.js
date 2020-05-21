#!/usr/bin/env node
/* jshint esversion: 6 */
const cli = require('commander');
const path = require('path');
const retropixels = require('.');
const { version } = require('./package');

cli
  .version(version)
  .usage('[options] <infile> <outfile>')
  .option('-m, --mode <graphicMode>', 'c64Multicolor (default), c64Hires, c64HiresMono, c64FLI, c64AFLI')
  .option('-d, --ditherMode <ditherMode>', 'bayer2x2, bayer4x4 (default), bayer8x8')
  .option('-r, --ditherRadius [0-64]', '0 = no dithering, 32 = default', parseInt)
  .option('-p, --palette <palette>', 'colodore (default), pepto, deekay, rainbow')
  .option('-c, --colorspace <colorspace>', 'xyz (default), yuv, rgb (no conversion)')
  .parse(process.argv);

// defaults
if (!cli.mode) {
  cli.mode = 'c64Multicolor';
}

if (!cli.ditherMode) {
  cli.ditherMode = 'bayer4x4';
}

if (cli.ditherRadius === undefined) {
  cli.ditherRadius = 32;
}

if (!cli.palette) {
  cli.palette = 'colodore';
}

if (!cli.colorspace) {
  cli.colorspace = 'xyz';
}

const graphicMode = retropixels.GraphicModes.all[cli.mode];
if (!graphicMode) {
  console.error(`Unknown graphicmode: ${cli.mode}`);
  cli.help();
  process.exit(1);
}

const ditherPreset = retropixels.OrderedDither.presets[cli.ditherMode];
if (!ditherPreset) {
  console.error(`Unknown ditherMode: ${cli.ditherMode}`);
  cli.help();
  process.exit(1);
}

const palette = retropixels.Palettes.all[cli.palette];
if (palette === undefined) {
  console.error(`Unknown palette: ${cli.palette}`);
  cli.help();
  process.exit(1);
}

const colorspace = retropixels.Quantizer.colorspaces[cli.colorspace];
if (colorspace === undefined) {
  console.error(`Unknown colorspace: ${cli.colorspace}`);
  cli.help();
  process.exit(1);
}

const ditherer = new retropixels.OrderedDither(ditherPreset, cli.ditherRadius);

const inFile = cli.args[0];
const outFile = cli.args[1];

if (inFile === undefined) {
  console.error('Input file missing.');
  cli.help();
}

if (outFile === undefined) {
  console.error('Output file missing.');
  cli.help();
}

function saveDebugMaps(pixelImage) {
  var mapimages = pixelImage.debugColorMaps();
  var i = 0;
  for (var mapimage of mapimages) {
    savePng(mapimage, outFile + '-map' + i++ + '.png');
  }
}

const converter = new retropixels.Converter();

converter.poker.quantizer.colorspace = colorspace;

const pixelImage = graphicMode.builder(palette);

retropixels.JimpPreprocessor.read(inFile, pixelImage.mode).then(jimpImage => {
  try {
    ditherer.dither(jimpImage);

    converter.convert(jimpImage, pixelImage);

    outExtension = path.extname(outFile);

    if ('.kla' === outExtension || '.spd' === outExtension) {
      retropixels.C64Writer.saveBinary(pixelImage, outFile).then(console.log(`${outFile}`));
    } else if ('.prg' === outExtension) {
      retropixels.C64Writer.savePrg(pixelImage, outFile).then(console.log(`${outFile}`));
    } else if ('.png' === outExtension) {
      retropixels.JimpPreprocessor.write(pixelImage, outFile).then(console.log(`${outFile}`));
    } else {
      throw `Unknown file extension ${outExtension}, valid extensions are .png, .kla and .prg`;
    }
  } catch (e) {
    console.error(e);
    cli.help();
    process.exit(1);
  }
});
