import { ColorMap } from '../model/ColorMap';
import { Palette } from '../model/Palette';
import { PixelImage } from '../model/PixelImage';
import { BinaryFile } from './BinaryFile';

/**
 * A Koala Painter compatible picture.
 */
export class KoalaPicture extends BinaryFile {

    /**
     * Get the Koala bitmap component from a PixelImage.
     */
    public static convertBitmap(pixelImage: PixelImage): Uint8Array {
        const bitmap: Uint8Array = new Uint8Array(8000);
        let bitmapIndex: number = 0;

        for (let charY: number = 0; charY < pixelImage.height; charY += 8) {
            for (let charX: number = 0; charX < pixelImage.width; charX += 4) {
                for (let bitmapY: number = 0; bitmapY < 8; bitmapY += 1) {
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
    }

    /**
     * Get the Koala screenram component from two ColorMaps
     */
    public static convertScreenram(lowerColorMap: ColorMap, upperColorMap: ColorMap): Uint8Array {
        const screenRam: Uint8Array = new Uint8Array(1000);
        let colorIndex: number = 0;

        for (let colorY: number = 0; colorY < lowerColorMap.height; colorY += 8) {
            for (let colorX: number = 0; colorX < lowerColorMap.width; colorX += 4) {
                // pack two colors in one byte
                screenRam[colorIndex] =
                    ((upperColorMap.get(colorX, colorY) << 4) & 0xf0)
                    | (lowerColorMap.get(colorX, colorY) & 0x0f);
                colorIndex += 1;
            }
        }
        return screenRam;
    }

    /**
     * Get the Koala colorram component from a ColorMap
     */
    public static convertColorram(colorMap: ColorMap): Uint8Array {
        const imageW: number = colorMap.width;
        const imageH: number = colorMap.height;
        const colorRam: Uint8Array = new Uint8Array(1000);
        let colorIndex: number = 0;

        for (let colorY: number = 0; colorY < imageH; colorY += 8) {
            for (let colorX: number = 0; colorX < imageW; colorX += 4) {
                colorRam[colorIndex] = colorMap.get(colorX, colorY) & 0x0f;
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
    public static fromPixelImage(pixelImage: PixelImage): KoalaPicture {
        const koalaPic: KoalaPicture = new KoalaPicture();

        koalaPic.loadAddress = new Uint8Array(2);
        koalaPic.loadAddress[0] = 0;
        koalaPic.loadAddress[1] = 0x60;

        koalaPic.bitmap = this.convertBitmap(pixelImage);
        koalaPic.screenRam = this.convertScreenram(pixelImage.colorMaps[2], pixelImage.colorMaps[1]);
        koalaPic.colorRam = this.convertColorram(pixelImage.colorMaps[3]);
        koalaPic.background = new Uint8Array(1);
        koalaPic.background[0] = pixelImage.colorMaps[0].get(0, 0);

        return koalaPic;
    }

    public loadAddress: Uint8Array;
    public bitmap: Uint8Array;
    public screenRam: Uint8Array;
    public colorRam: Uint8Array;
    public background: Uint8Array;

    /**
     * Read the picture from an 8-bit buffer.
     * @param  {Uint8Array} arrayBuffer The buffer to read.
     */
    public read(arrayBuffer: Uint8Array): void {
        this.loadAddress = new Uint8Array(arrayBuffer, 0, 2);
        this.bitmap = new Uint8Array(arrayBuffer, 2, 8000);
        this.screenRam = new Uint8Array(arrayBuffer, 8002, 1000);
        this.colorRam = new Uint8Array(arrayBuffer, 9002, 1000);
        this.background = new Uint8Array(arrayBuffer, 10002, 1);
    }

    /**
     * Convert to a sequence of bytes.
     * @return {Uint8Array} A sequence of 8-bit bytes.
     */
    public toMemoryMap(): Uint8Array[] {
        return [
            this.loadAddress,
            this.bitmap,
            this.screenRam,
            this.colorRam,
            this.background,
        ];
    }

    /**
     * Convert a Koala Painter picture to a PixelImage.
     */
    public toPixelImage(koalaPic: KoalaPicture, palette: Palette): PixelImage {
        const imageW = 160;
        const imageH = 200;
        const pixelImage: PixelImage = new PixelImage(imageW, imageH, 2, 1);
        const pixelsPerCellHor = 4;
        const pixelsPerCellVer = 8;

        let bitmapIndex = 0;
        let colorIndex = 0;

        pixelImage.addColorMap(new ColorMap(imageW, imageH, palette));
        pixelImage.addColorMap(new ColorMap(imageW, imageH, palette, pixelsPerCellHor, pixelsPerCellVer));
        pixelImage.addColorMap(new ColorMap(imageW, imageH, palette, pixelsPerCellHor, pixelsPerCellVer));
        pixelImage.addColorMap(new ColorMap(imageW, imageH, palette, pixelsPerCellHor, pixelsPerCellVer));

        for (let charY = 0; charY < imageH; charY += pixelsPerCellVer) {
            for (let charX = 0; charX < imageW; charX += pixelsPerCellHor) {
                for (let bitmapY = 0; bitmapY < pixelsPerCellVer; bitmapY += 1) {

                    const pixelX = charX;
                    const pixelY = charY + bitmapY;

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
                const color01 = (koalaPic.screenRam[colorIndex] >> 4) & 0x0f;
                const color10 = koalaPic.screenRam[colorIndex] & 0x0f;
                const color11 = koalaPic.colorRam[colorIndex] & 0x0f;

                // add the colors to the corresponding color maps
                pixelImage.colorMaps[1].put(colorX, colorY, color01);
                pixelImage.colorMaps[2].put(colorX, colorY, color10);
                pixelImage.colorMaps[3].put(colorX, colorY, color11);

                colorIndex += 1;
            }
        }
        // add background color as colorMap 0
        pixelImage.colorMaps[0].put(0, 0, koalaPic.background[0]);
        return pixelImage;
    }
}
