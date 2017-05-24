#!/usr/bin/env node
/* jshint esversion: 6 */
const cli = require('commander'),
	fs = require('fs-extra'),
	path = require('path'),
	jimp = require('jimp'),
	GraphicModes = require('./target/profiles/GraphicModes.js'),
	Pixels = require('./target/model/Pixels.js'),
	KoalaPicture = require('./target/io/KoalaPicture.js'),
	Converter = require('./target/conversion/Converter.js'),
	ImageData = require('./target/model/ImageData.js');

// default mode
let graphicMode = GraphicModes.all['c64Multicolor'];

cli.version('0.2.0')
	.usage('[options] <infile> <outfile>')
	.option('-m, --mode [graphicMode]', 'Graphicmode to use. One of c64Multicolor (default), c64Hires, c64HiresMono, c64FLI, c64AFLI')
	.parse(process.argv);

if (cli.mode) {
	if (cli.mode in GraphicModes.all) {
		console.log('Using graphicMode ' + cli.mode);
		graphicMode = GraphicModes.all[cli.mode];
	} else {
		console.error('Unknown Graphicmode: ' + cli.mode);
		cli.help();
		process.exit(1);
	}
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

	if (cli.mode !== 'c64Multicolor') {
		throw 'Commodore 64 executable format is only supported for c64Multicolor mode.';
	}

	const koalaImage = KoalaPicture.KoalaPicture.fromPixelImage(pixelImage),
		binary = path.join(__dirname, '/src/c64/KoalaShower.prg');

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

// Save PixelImage as a KoalaPaint image.
function saveKoala(pixelImage) {
	if (cli.mode !== 'c64Multicolor') {
		throw 'Koala painter format is only supported for c64Multicolor mode.';
	}
	const koalaImage = KoalaPicture.KoalaPicture.fromPixelImage(pixelImage);
	fs.writeFile(outFile, new Buffer(koalaImage.toBytes()), function(err) {
		if (err) throw err;
		console.log('Written Koala Painter file ' + outFile);
	});
}

// Save PixelImage as a PNG image.
function savePng(pixelImage) {
	new jimp(pixelImage.width, pixelImage.height, function(err, image) {
		if (err) throw err;
		for (let y = 0; y < image.bitmap.height; y += 1) {
			for (let x = 0; x < image.bitmap.width; x += 1) {
				ImageData.ImageData.poke(image.bitmap, x, y, pixelImage.peek(x, y));
			}
		}
		image.resize(pixelImage.width * pixelImage.pWidth, pixelImage.height * pixelImage.pHeight);
		image.write(outFile, function() {
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
	try {
		if (err) throw err;

		cropFill(jimpImage, graphicMode.width * graphicMode.pixelWidth, graphicMode.height * graphicMode.pixelHeight);
		jimpImage.resize(graphicMode.width, graphicMode.height);

		const converter = new Converter.Converter(graphicMode);
		const pixelImage = converter.convert(jimpImage.bitmap);

		outExtension = path.extname(outFile);

		if ('.kla' === outExtension) {
			saveKoala(pixelImage);
		} else if ('.prg' === outExtension) {
			savePrg(pixelImage);
		} else if ('.png' === outExtension) {
			savePng(pixelImage);
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