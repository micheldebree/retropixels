/* jshint esversion: 6 */
const BinaryFile = require('./BinaryFile.js');

class KoalaPicture extends BinaryFile {

    read(arrayBuffer) {
        this.loadAddress = new Uint8Array(arrayBuffer, 0, 2);
        this.bitmap = new Uint8Array(arrayBuffer, 2, 8000);
        this.screenRam = new Uint8Array(arrayBuffer, 8002, 1000);
        this.colorRam = new Uint8Array(arrayBuffer, 9002, 1000);
        this.background = new Uint8Array(arrayBuffer, 10002, 1);
    }

    /**
     * Convert to a sequence of bytes.
     */
    toBytes() {
        return this.concat([
            this.loadAddress,
            this.bitmap,
            this.screenRam,
            this.colorRam,
            this.background
        ]);
    }

    /**
     * Get a url to download this picture.
     */
    toUrl() {
        return this.toObjectUrl(this.toBytes());
    }

    /**
     * Get the Koala bitmap component from a PixelImage.
     */
    static convertBitmap(pixelImage) {
        const bitmap = new Uint8Array(8000);
        let bitmapIndex = 0;

        for (let charY = 0; charY < pixelImage.height; charY += 8) {
            for (let charX = 0; charX < pixelImage.width; charX += 4) {
                for (let bitmapY = 0; bitmapY < 8; bitmapY += 1) {
                    // pack 4 pixels into one byte
                    bitmap[bitmapIndex] =
                        pixelImage.getPixelIndex(charX, charY + bitmapY) << 6 | pixelImage.getPixelIndex(charX + 1, charY + bitmapY) << 4 | pixelImage.getPixelIndex(charX + 2, charY + bitmapY) << 2 | pixelImage.getPixelIndex(charX + 3, charY + bitmapY);
                    bitmapIndex += 1;
                }
            }
        }
        return bitmap;
    }

    /**
     * Get the Koala screenram component from two ColorMaps
     */
    static convertScreenram(lowerColorMap, upperColorMap) {
        const screenRam = new Uint8Array(1000);
        var colorIndex = 0;

        for (let colorY = 0; colorY < lowerColorMap.height; colorY += 8) {
            for (let colorX = 0; colorX < lowerColorMap.width; colorX += 4) {
                // pack two colors in one byte
                screenRam[colorIndex] =
                    ((upperColorMap.getColor(colorX, colorY) << 4) & 0xf0) | (lowerColorMap.getColor(colorX, colorY) & 0x0f);
                colorIndex += 1;
            }
        }
        return screenRam;
    }

    /**
     * Get the Koala colorram component from a ColorMap
     */
    static convertColorram(colorMap) {
        const imageW = colorMap.width,
            imageH = colorMap.height,
            colorRam = new Uint8Array(1000);
        let colorIndex = 0;

        for (let colorY = 0; colorY < imageH; colorY += 8) {
            for (let colorX = 0; colorX < imageW; colorX += 4) {
                colorRam[colorIndex] = colorMap.getColor(colorX, colorY) & 0x0f;
                colorIndex += 1;
            }
        }
        return colorRam;
    }

    /**
     * Convert a pixelImage to a KoalaPic
     * PixelImage must have the following specs:
     * - 320 x 160 pixels
     * - colormap 0 has one color, the background color
     * - colormap 1 and 2 have the screenram
     * - colormap 3 has the colorram
     */
    static fromPixelImage(pixelImage) {
        const koalaPic = new KoalaPicture();

        koalaPic.loadAddress = new Uint8Array(2);
        koalaPic.loadAddress[0] = 0;
        koalaPic.loadAddress[1] = 0x60;

        koalaPic.bitmap = this.convertBitmap(pixelImage);
        koalaPic.screenRam = this.convertScreenram(pixelImage.colorMaps[2], pixelImage.colorMaps[1]);
        koalaPic.colorRam = this.convertColorram(pixelImage.colorMaps[3]);
        koalaPic.background = new Uint8Array(1);
        koalaPic.background[0] = pixelImage.colorMaps[0].getColor(0, 0);

        return koalaPic;
    }

    /**
     * Convert a Koala Painter picture to a PixelImage.
     */
    toPixelImage(koalaPic, palette) {
        const imageW = 160,
            imageH = 200,
            pixelImage = new PixelImage(imageW, imageH, 2, 1),
            pixelsPerCellHor = 4,
            pixelsPerCellVer = 8;

        let bitmapIndex = 0,
            colorIndex = 0;

        pixelImage.palette = palette;
        pixelImage.addColorMap(new ColorMap(imageW, imageH, imageW, imageH));
        pixelImage.addColorMap(new ColorMap(imageW, imageH, pixelsPerCellHor, pixelsPerCellVer));
        pixelImage.addColorMap(new ColorMap(imageW, imageH, pixelsPerCellHor, pixelsPerCellVer));
        pixelImage.addColorMap(new ColorMap(imageW, imageH, pixelsPerCellHor, pixelsPerCellVer));

        for (let charY = 0; charY < imageH; charY += pixelsPerCellVer) {
            for (let charX = 0; charX < imageW; charX += pixelsPerCellHor) {
                for (let bitmapY = 0; bitmapY < pixelsPerCellVer; bitmapY += 1) {

                    let pixelX = charX;
                    let pixelY = charY + bitmapY;

                    pixelImage.setPixelIndex(pixelX, pixelY, (koalaPic.bitmap[bitmapIndex] >> 6) & 0x03);
                    pixelImage.setPixelIndex(pixelX + 1, pixelY, (koalaPic.bitmap[bitmapIndex] >> 4) & 0x03);
                    pixelImage.setPixelIndex(pixelX + 2, pixelY, (koalaPic.bitmap[bitmapIndex] >> 2) & 0x03);
                    pixelImage.setPixelIndex(pixelX + 3, pixelY, koalaPic.bitmap[bitmapIndex] & 0x03);

                    bitmapIndex += 1;
                }

            }
        }

        for (let colorY = 0; colorY < imageH; colorY += pixelsPerCellVer) {
            for (let colorX = 0; colorX < imageW; colorX += pixelsPerCellHor) {

                // get two colors from screenRam and one from colorRam
                let color01 = (koalaPic.screenRam[colorIndex] >> 4) & 0x0f;
                let color10 = koalaPic.screenRam[colorIndex] & 0x0f;
                let color11 = koalaPic.colorRam[colorIndex] & 0x0f;

                // add the colors to the corresponding color maps
                pixelImage.colorMaps[1].add(colorX, colorY, color01);
                pixelImage.colorMaps[2].add(colorX, colorY, color10);
                pixelImage.colorMaps[3].add(colorX, colorY, color11);

                colorIndex += 1;

            }
        }
        // add background color as colorMap 0
        pixelImage.colorMaps[0].add(0, 0, koalaPic.background[0]);
        return pixelImage;
    }
}
module.exports = KoalaPicture;
