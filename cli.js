#!/usr/bin/env node
/* jshint esversion: 6 */
const cli = require('commander');
const path = require('path');
const { promisify } = require('util');
const fs = require('fs');
const fsStat = promisify(fs.stat);
const retropixels = require('.');

const { version } = require('./package');

cli
  .version(version)
  .usage('[options] <infile>')
  .option('-o, --outfile <outfile>')
  .option('-m, --mode <graphicMode>', 'bitmap (default), fli, afli, sprites')
  .option('-f, --format <output format>', 'png, prg')
  .option('-d, --ditherMode <ditherMode>', 'bayer2x2, bayer4x4 (default), bayer8x8')
  .option('-r, --ditherRadius [0-64]', '0 = no dithering, 32 = default', parseInt)
  .option('-p, --palette <palette>', 'colodore (default), pepto, deekay')
  .option('-c, --colorspace <colorspace>', 'xyz (default), yuv, rgb (no conversion), rainbow')
  .option('--cols <columns>', 'number of columns of sprites, default = 8', parseInt)
  .option('--rows <rows>', 'number of rows of sprites, default = 8', parseInt)
  .option('-h, --hires', 'hires mode')
  .option('--nomaps', 'use one color per attribute instead of a map')
  .option('-s, --scale <mode>', 'none, fill (default)')
  .option('--overwrite', 'force overwrite of existing output file')
  .parse(process.argv);

// defaults

const options = cli.opts();

if (!options.mode) {
  options.mode = 'bitmap';
}

if (!options.ditherMode) {
  options.ditherMode = 'bayer4x4';
}

if (!options.scale) {
  options.scale = 'fill';
}

if (options.ditherRadius === undefined) {
  options.ditherRadius = 32;
}

if (!options.palette) {
  options.palette = 'colodore';
}

if (!options.colorspace) {
  options.colorspace = 'xyz';
}

if (!options.cols) {
  options.cols = 8;
}

if (!options.rows) {
  options.rows = 8;
}

const graphicMode = retropixels.GraphicModes.all[options.mode];
if (!graphicMode) {
  console.error(`Unknown graphicMode: ${options.mode}`);
  cli.help();
  process.exit(1);
}

const ditherPreset = retropixels.OrderedDither.presets[options.ditherMode];
if (!ditherPreset) {
  console.error(`Unknown ditherMode: ${options.ditherMode}`);
  cli.help();
  process.exit(1);
}

const palette = retropixels.Palettes.all[options.palette];
if (palette === undefined) {
  console.error(`Unknown palette: ${options.palette}`);
  cli.help();
  process.exit(1);
}

const colorspace = retropixels.Quantizer.colorspaces[options.colorspace];
if (colorspace === undefined) {
  console.error(`Unknown colorspace: ${options.colorspace}`);
  cli.help();
  process.exit(1);
}

const ditherer = new retropixels.OrderedDither(ditherPreset, options.ditherRadius);

const inFile = cli.args[0];

if (inFile === undefined) {
  console.error('Input file missing.');
  cli.help();
}

// function saveDebugMaps(pixelImage) {
//   const mapimages = pixelImage.debugColorMaps();
//   let i = 0;
//   for (let mapimage of mapimages) {
//     savePng(mapimage, `${outFile}-map${i++}.png`);
//   }
// }

async function checkOverwrite(filename) {
  try {
    await fsStat(filename);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw new Error(`Could not write file ${filename}: ${err.code}`);
    }
    return;
  }
  if (!options.overwrite) {
    throw new Error(`Output file ${filename} already exists. Use --overwrite to force overwriting output file.`);
  }
}

function getOutFile(extension) {
  if (options.outfile) {
    return options.outfile;
  }

  const baseName = path.basename(inFile, path.extname(inFile));
  return `${baseName}.${extension}`;
}

const quantizer = new retropixels.Quantizer(palette, colorspace);
const poker = new retropixels.Poker(quantizer);
const converter = new retropixels.Converter(poker);

const pixelImage = graphicMode.builder({
  rows: options.rows,
  columns: options.cols,
  hires: options.hires,
  nomaps: options.nomaps
});

retropixels.JimpPreprocessor.read(inFile, pixelImage.mode, options.scale)
  .then(async jimpImage => {
    if (options.ditherMode !== 'none') {
      ditherer.dither(jimpImage);
    }

    converter.convert(jimpImage, pixelImage);

    let outFile;
    if (!options.format) {
      const outputFormat = retropixels.C64Writer.getFormat(pixelImage);
      outFile = getOutFile(outputFormat.defaultExtension);
      await checkOverwrite(outFile);
      outputFormat.fromPixelImage(pixelImage);
      await retropixels.C64Writer.save(outputFormat, outFile);
    } else if (options.format === 'prg') {
      outFile = getOutFile('prg');
      checkOverwrite(outFile);
      await retropixels.C64Writer.savePrg(pixelImage, outFile);
    } else if (options.format === 'png') {
      outFile = getOutFile('png');
      checkOverwrite(outFile);
      await retropixels.JimpPreprocessor.write(pixelImage, outFile, palette);
    }

    console.log(outFile);
  })
  .catch(error => {
    if (error.code === 'ENOENT') {
      console.error(`\nERROR: ${error.path} does not exist.\n`);
    } else {
      console.error(`\nERROR: ${error.message}\n`);
    }
    cli.help();
  });
