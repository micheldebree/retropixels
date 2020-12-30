#!/usr/bin/env node
/* jshint esversion: 6 */
const cli = require('commander');
const path = require('path');
const retropixels = require('.');
const { version } = require('./package');

cli
  .version(version)
  .usage('[options] <infile> <outfile>')
  .option('-m, --mode <graphicMode>', 'bitmap (default), c64FLI, c64AFLI, c64Sprites')
  .option('-d, --ditherMode <ditherMode>', 'bayer2x2, bayer4x4 (default), bayer8x8')
  .option('-r, --ditherRadius [0-64]', '0 = no dithering, 32 = default', parseInt)
  .option('-p, --palette <palette>', 'colodore (default), pepto, deekay, rainbow')
  .option('-c, --colorspace <colorspace>', 'xyz (default), yuv, rgb (no conversion)')
  .option('--cols <columns>', 'number of columns of sprites', parseInt)
  .option('--rows <rows>', 'number of rows of sprites', parseInt)
  .option('--hires', 'hires mode')
  .option('--nomaps', 'use one color per attribute instead of a map')
  .parse(process.argv);

// defaults
if (!cli.mode) {
  cli.mode = 'bitmap';
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

if (!cli.cols) {
  cli.cols = 8;
}

if (!cli.rows) {
  cli.rows = 8;
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
  const mapimages = pixelImage.debugColorMaps();
  let i = 0;
  for (let mapimage of mapimages) {
    savePng(mapimage, outFile + '-map' + i++ + '.png');
  }
}

const quantizer = new retropixels.Quantizer(palette, colorspace);
const poker = new retropixels.Poker(quantizer);
const converter = new retropixels.Converter(poker);

// props are only used in sprite mode for now
const pixelImage = graphicMode.builder(palette, {
  rows: cli.rows,
  columns: cli.cols,
  multicolor: !cli.hires,
  nomaps: cli.nomaps
});

retropixels.JimpPreprocessor.read(inFile, pixelImage.mode)
  .then(async jimpImage => {
    try {
      ditherer.dither(jimpImage);

      converter.convert(jimpImage, pixelImage);

      const outExtension = path.extname(outFile);

      if ('.kla' === outExtension || '.spd' === outExtension) {
        await retropixels.C64Writer.saveBinary(pixelImage, outFile);
        console.log(`${outFile}`);
      } else if ('.prg' === outExtension) {
        await retropixels.C64Writer.savePrg(pixelImage, outFile);
        console.log(`${outFile}`);
      } else if ('.png' === outExtension) {
        await retropixels.JimpPreprocessor.write(pixelImage, outFile);
        console.log(`${outFile}`);
      } else {
        throw `Unknown file extension ${outExtension}, valid extensions are .png, .kla and .prg`;
      }
    } catch (e) {
      console.error(e);
      cli.help();
      process.exit(1);
    }
  })
  .catch(error => {
    if (error.code === 'ENOENT') {
      console.error(`\nERROR: ${error.path} does not exist.\n`);
    } else {
      console.error(error);
    }
    cli.help();
    process.exit(error.errno);
  });
