#!/usr/bin/env node
/* jshint esversion: 6 */
const cli = require('commander');
const path = require('path');
const fs = require('fs');
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
  .option('-p, --palette <palette>', 'colodore (default), pepto, deekay, rainbow')
  .option('-c, --colorspace <colorspace>', 'xyz (default), yuv, rgb (no conversion)')
  .option('--cols <columns>', 'number of columns of sprites, default = 8', parseInt)
  .option('--rows <rows>', 'number of rows of sprites, default = 8', parseInt)
  .option('-h, --hires', 'hires mode')
  .option('--nomaps', 'use one color per attribute instead of a map')
  .option('-s, --scale <mode>', 'none, fill (default)')
  .option('--overwrite', 'force overwrite of existing output file')
  .parse(process.argv);

// defaults

if (!cli.mode) {
  cli.mode = 'bitmap';
}

if (!cli.ditherMode) {
  cli.ditherMode = 'bayer4x4';
}

if (!cli.scale) {
  cli.scale = 'fill';
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

if (inFile === undefined) {
  console.error('Input file missing.');
  cli.help();
}

function saveDebugMaps(pixelImage) {
  const mapimages = pixelImage.debugColorMaps();
  let i = 0;
  for (let mapimage of mapimages) {
    savePng(mapimage, outFile + '-map' + i++ + '.png');
  }
}

async function checkOverwrite(filename) {
  return fs.stat(filename, (err, stat) => {
    if (err === null && !cli.overwrite) {
      throw new Error(`Output file ${filename} already exists. Use --overwrite to force overwriting output file.`);
    }
    if (err !== null && err.code !== 'ENOENT') {
      throw new Error('Could not write file ${filename}: ${err.code}');
    }
  });
}

function getOutFile(extension) {
  if (cli.outfile) {
    return cli.outfile;
  }

  const baseName = path.basename(inFile, path.extname(inFile));
  return `${baseName}.${extension}`;
}

const quantizer = new retropixels.Quantizer(palette, colorspace);
const poker = new retropixels.Poker(quantizer);
const converter = new retropixels.Converter(poker);

// props are only used in sprite mode for now
const pixelImage = graphicMode.builder(palette, {
  rows: cli.rows,
  columns: cli.cols,
  hires: cli.hires,
  nomaps: cli.nomaps
});

retropixels.JimpPreprocessor.read(inFile, pixelImage.mode, cli.scale)
  .then(async jimpImage => {
    try {
      if (cli.ditherMode !== 'none') {
        ditherer.dither(jimpImage);
      }

      converter.convert(jimpImage, pixelImage);

      let outFile;
      if (!cli.format) {
        const outputFormat = retropixels.C64Writer.getFormat(pixelImage);
        outFile = getOutFile(outputFormat.defaultExtension);
        await checkOverwrite(outFile);
        outputFormat.fromPixelImage(pixelImage);
        await retropixels.C64Writer.save(outputFormat, outFile);
      } else if (cli.format === 'prg') {
        outFile = getOutFile('prg');
        checkOverwrite(outFile);
        await retropixels.C64Writer.savePrg(pixelImage, outFile);
      } else if (cli.format === 'png') {
        outFile = getOutFile('png');
        checkOverwrite(outFile);
        await retropixels.JimpPreprocessor.write(pixelImage, outFile);
      }

      console.log(outFile);
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
      console.error(`\nERROR: ${error.message}\n`);
    }
    cli.help();
    process.exit(error.errno);
  });
