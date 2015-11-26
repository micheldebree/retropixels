/*global Uint8Array, PixelImage, ColorMap, BinaryFile */
/*jslint bitwise: true*/
function KoalaPicture() {

    'use strict';

    // 2 bytes load address (default $6000)
    this.loadAddress = new Uint8Array(2);
    this.loadAddress[0] = 0;
    this.loadAddress[1] = 0x60;
    // 8000 bytes bitmap data
    this.bitmap = new Uint8Array(8000);
    // 1000 bytes of screenram ($0400)
    this.screenRam = new Uint8Array(1000);
    // 1000 bytes of colorram ($d800)
    this.colorRam = new Uint8Array(1000);
    // 1 byte background color
    this.background = new Uint8Array(1);

}

KoalaPicture.prototype = new BinaryFile();
KoalaPicture.prototype.constructor = BinaryFile;

KoalaPicture.prototype.read = function (arrayBuffer) {
    'use strict';
    this.loadAddress = new Uint8Array(arrayBuffer, 0, 2);
    this.bitmap = new Uint8Array(arrayBuffer, 2, 8000);
    this.screenRam = new Uint8Array(arrayBuffer, 8002, 1000);
    this.colorRam = new Uint8Array(arrayBuffer, 9002, 1000);
    this.background = new Uint8Array(arrayBuffer, 10002, 1);
};

/**
 * Convert to a sequence of bytes.
 */
KoalaPicture.prototype.toBytes = function() {
  'use strict';
  return this.concat([
      this.loadAddress,
      this.bitmap,
      this.screenRam,
      this.colorRam,
      this.background
  ]);
};

/**
 * Get a url to download this picture.
 */
KoalaPicture.prototype.toUrl = function () {
    'use strict';
    return this.toObjectUrl(this.toBytes());
};

/**
 * Get the Koala bitmap component from a PixelImage.
 */
KoalaPicture.prototype.convertBitmap = function (pixelImage) {
    'use strict';
    var charY,
        charX,
        bitmapY,
        bitmap = new Uint8Array(8000),
        bitmapIndex = 0;

    for (charY = 0; charY < pixelImage.height; charY += 8) {
        for (charX = 0; charX < pixelImage.width; charX += 4) {
            for (bitmapY = 0; bitmapY < 8; bitmapY += 1) {

                // pack 4 pixels into one byte
                bitmap[bitmapIndex] =
                    pixelImage.getPixelIndex(charX, charY + bitmapY) << 6
                    | pixelImage.getPixelIndex(charX + 1, charY + bitmapY) << 4
                    | pixelImage.getPixelIndex(charX + 2, charY + bitmapY) << 2
                    | pixelImage.getPixelIndex(charX + 3, charY + bitmapY);

                bitmapIndex += 1;
            }
        }
    }
    return bitmap;
};

/**
 * Get the Koala screenram component from two ColorMaps
 */
KoalaPicture.prototype.convertScreenram = function (lowerColorMap, upperColorMap) {
    'use strict';

    var colorX,
        colorY,
        colorIndex = 0,
        screenRam = new Uint8Array(1000);

    for (colorY = 0; colorY < lowerColorMap.height; colorY += 8) {
        for (colorX = 0; colorX < lowerColorMap.width; colorX += 4) {

            // pack two colors in one byte
            screenRam[colorIndex] =
                ((upperColorMap.getColor(colorX, colorY) << 4) & 0xf0)
                | (lowerColorMap.getColor(colorX, colorY) & 0x0f);
            colorIndex += 1;
        }
    }
    return screenRam;

};

/**
 * Get the Koala colorram component from a ColorMap
 */
KoalaPicture.prototype.convertColorram = function (colorMap) {
    'use strict';
    var colorX,
        colorY,
        imageW = colorMap.width,
        imageH = colorMap.height,
        colorIndex = 0,
        colorRam = new Uint8Array(1000);

    for (colorY = 0; colorY < imageH; colorY += 8) {
        for (colorX = 0; colorX < imageW; colorX += 4) {
            colorRam[colorIndex] = colorMap.getColor(colorX, colorY) & 0x0f;
            colorIndex += 1;
        }
    }

    return colorRam;

};

/**
 * Convert a pixelImage to a KoalaPic
 * PixelImage must have the following specs:
 * - 320 x 160 pixels
 * - colormap 0 has one color, the background color
 * - colormap 1 and 2 have the screenram
 * - colormap 3 has the colorram
 */
KoalaPicture.prototype.fromPixelImage = function (pixelImage) {
    'use strict';

    var koalaPic = new KoalaPicture();

    koalaPic.bitmap = this.convertBitmap(pixelImage);
    koalaPic.screenRam = this.convertScreenram(pixelImage.colorMaps[2], pixelImage.colorMaps[1]);
    koalaPic.colorRam = this.convertColorram(pixelImage.colorMaps[3]);
    koalaPic.background[0] = pixelImage.colorMaps[0].getColor(0, 0);

    return koalaPic;

};

/**
 * Convert a Koala Painter picture to a PixelImage.
 */
KoalaPicture.prototype.toPixelImage = function (koalaPic, palette) {
    'use strict';
    var pixelImage = new PixelImage(),
        charX,
        charY,
        bitmapY,
        pixel0,
        pixel1,
        pixel2,
        pixel3,
        bitmapIndex = 0,
        colorX,
        colorY,
        color01,
        color10,
        color11,
        imageW = 160,
        imageH = 200,
        colorIndex = 0,
        pixelsPerCellHor = 4,
        pixelsPerCellVer = 8,
        pixelX,
        pixelY;

    pixelImage.init(imageW, imageH);
    pixelImage.palette = palette;
    pixelImage.addColorMap(new ColorMap(imageW, imageH, imageW, imageH));
    pixelImage.addColorMap(new ColorMap(imageW, imageH, pixelsPerCellHor, pixelsPerCellVer));
    pixelImage.addColorMap(new ColorMap(imageW, imageH, pixelsPerCellHor, pixelsPerCellVer));
    pixelImage.addColorMap(new ColorMap(imageW, imageH, pixelsPerCellHor, pixelsPerCellVer));

    for (charY = 0; charY < imageH; charY += pixelsPerCellVer) {
        for (charX = 0; charX < imageW; charX += pixelsPerCellHor) {
            for (bitmapY = 0; bitmapY < pixelsPerCellVer; bitmapY += 1) {

                // get 4 pixels from one koala byte
                pixel0 = (koalaPic.bitmap[bitmapIndex] >> 6) & 0x03;
                pixel1 = (koalaPic.bitmap[bitmapIndex] >> 4) & 0x03;
                pixel2 = (koalaPic.bitmap[bitmapIndex] >> 2) & 0x03;
                pixel3 = koalaPic.bitmap[bitmapIndex] & 0x03;

                pixelX = charX;
                pixelY = charY + bitmapY;

                pixelImage.setPixelIndex(pixelX, pixelY, pixel0);
                pixelImage.setPixelIndex(pixelX + 1, pixelY, pixel1);
                pixelImage.setPixelIndex(pixelX + 2, pixelY, pixel2);
                pixelImage.setPixelIndex(pixelX + 3, pixelY, pixel3);

                bitmapIndex += 1;
            }

        }
    }

    for (colorY = 0; colorY < imageH; colorY += pixelsPerCellVer) {
        for (colorX = 0; colorX < imageW; colorX += pixelsPerCellHor) {

            // get two colors from screenRam and one from colorRam
            color01 = (koalaPic.screenRam[colorIndex] >> 4) & 0x0f;
            color10 = koalaPic.screenRam[colorIndex] & 0x0f;
            color11 = koalaPic.colorRam[colorIndex] & 0x0f;

            // add the colors to the corresponding color maps
            pixelImage.colorMaps[1].add(colorX, colorY, color01);
            pixelImage.colorMaps[2].add(colorX, colorY, color10);
            pixelImage.colorMaps[3].add(colorX, colorY, color11);

            colorIndex += 1;

        }
    }
    // add background color as colorMap 0
    pixelImage.colorMaps[0].add(0, 0, koalaPic.background[0]);
    pixelImage.pWidth = 2;
    pixelImage.pHeight = 1;
    return pixelImage;
};
