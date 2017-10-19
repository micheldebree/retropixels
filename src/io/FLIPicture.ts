import { ColorMap } from '../model/ColorMap';
import { Palette } from '../model/Palette';
import { PixelImage } from '../model/PixelImage';
import { BinaryFile } from './BinaryFile';

/**
 * A FLI picture.
 * $3800-$3fff color ram data -> $d800
 * $4000-$5fff screen ram data
 * $6000-      bitmap data
 */
export class FLIPicture extends BinaryFile {

    public static convertBitmap(pixelImage: PixelImage): Uint8Array {
        const bitmap: Uint8Array = new Uint8Array(8000);
        let bitmapIndex: number = 0;

        for (let charY: number = 0; charY < pixelImage.height; charY += 8) {
            for (let charX: number = 0; charX < pixelImage.width; charX += 4) {
                for (let bitmapY: number = 0; bitmapY < 8; bitmapY += 1) {
                    // pack 4 pixels into one byte
                    if (charX > FLIPicture.FLIBugSize) {
                        bitmap[bitmapIndex] =
                            FLIPicture.mapPixelIndex(pixelImage, charX, charY + bitmapY) << 6
                            | FLIPicture.mapPixelIndex(pixelImage, charX + 1, charY + bitmapY) << 4
                            | FLIPicture.mapPixelIndex(pixelImage, charX + 2, charY + bitmapY) << 2
                            | FLIPicture.mapPixelIndex(pixelImage, charX + 3, charY + bitmapY);
                    }
                    bitmapIndex++;
                }
            }
        }
        return bitmap;
    }

    public static convertScreenram(row: number, lowerColorMap: ColorMap, upperColorMap: ColorMap): Uint8Array {
        const screenRam: Uint8Array = new Uint8Array(1000);
        let colorIndex: number = 0;

        for (let colorY: number = row; colorY < lowerColorMap.height; colorY += 8) {
            for (let colorX: number = 0; colorX < lowerColorMap.width; colorX += 4) {
                // pack two colors in one byte
                if (colorX > FLIPicture.FLIBugSize) {
                    screenRam[colorIndex] =
                        ((upperColorMap.get(colorX, colorY) << 4) & 0xf0)
                        | (lowerColorMap.get(colorX, colorY) & 0x0f);
                }
                colorIndex++;
            }
        }
        return screenRam;
    }

    public static convertColorram(colorMap: ColorMap): Uint8Array {
        const imageW: number = colorMap.width;
        const imageH: number = colorMap.height;
        const colorRam: Uint8Array = new Uint8Array(1000);
        let colorIndex: number = 0;

        for (let colorY: number = 0; colorY < imageH; colorY += 8) {
            for (let colorX: number = 0; colorX < imageW; colorX += 4) {
                if (colorX > FLIPicture.FLIBugSize) {
                    colorRam[colorIndex] = colorMap.get(colorX, colorY) & 0x0f;
                }
                colorIndex++;
            }
        }
        return colorRam;
    }

    public static fromPixelImage(pixelImage: PixelImage): FLIPicture {
        const pic: FLIPicture = new FLIPicture();

        pic.loadAddress = new Uint8Array(2);
        pic.loadAddress[0] = 0;
        pic.loadAddress[1] = 0x3c;

        pic.colorRam = this.convertColorram(pixelImage.colorMaps[1]);
        pic.bitmap = this.convertBitmap(pixelImage);
        pic.screenRam0 = this.convertScreenram(0, pixelImage.colorMaps[2], pixelImage.colorMaps[3]);
        pic.screenRam1 = this.convertScreenram(1, pixelImage.colorMaps[2], pixelImage.colorMaps[3]);
        pic.screenRam2 = this.convertScreenram(2, pixelImage.colorMaps[2], pixelImage.colorMaps[3]);
        pic.screenRam3 = this.convertScreenram(3, pixelImage.colorMaps[2], pixelImage.colorMaps[3]);
        pic.screenRam4 = this.convertScreenram(4, pixelImage.colorMaps[2], pixelImage.colorMaps[3]);
        pic.screenRam5 = this.convertScreenram(5, pixelImage.colorMaps[2], pixelImage.colorMaps[3]);
        pic.screenRam6 = this.convertScreenram(6, pixelImage.colorMaps[2], pixelImage.colorMaps[3]);
        pic.screenRam7 = this.convertScreenram(7, pixelImage.colorMaps[2], pixelImage.colorMaps[3]);

        pic.background = new Uint8Array(1);
        pic.background[0] = pixelImage.colorMaps[0].get(0, 0);

        return pic;
    }

    private static FLIBugSize: number  = 8;

    private static indexMap = {
        0: 0,
        1: 3,
        2: 2,
        3: 1,
    };

    /**
     * Map the index value in the PixelImage (0-3) to an index value in the FLI bitmap (0-3)
     * This way the indexes of the ColorMaps in PixelImage do
     * not have to be in the same order as the FLI destination image.
     * @param pixelImage The PixelImage
     * @param x The x location of the pixel index to be mapped
     * @param y The x location of the pixel index to be mapped
     */
    private static mapPixelIndex(pixelImage: PixelImage, x: number, y: number) {
        return FLIPicture.indexMap[pixelImage.getPixelIndex(x, y)];
    }

    public loadAddress: Uint8Array;
    public colorRam: Uint8Array;
    public screenRam0: Uint8Array;
    public screenRam1: Uint8Array;
    public screenRam2: Uint8Array;
    public screenRam3: Uint8Array;
    public screenRam4: Uint8Array;
    public screenRam5: Uint8Array;
    public screenRam6: Uint8Array;
    public screenRam7: Uint8Array;
    public bitmap: Uint8Array;
    public background: Uint8Array;

    /**
     * Convert to a sequence of bytes.
     * @return {Uint8Array} A sequence of 8-bit bytes.
     */
    public toMemoryMap(): Uint8Array[] {
        return [
            this.loadAddress,
            this.pad(this.colorRam, 24),
            this.pad(this.screenRam0, 24),
            this.pad(this.screenRam1, 24),
            this.pad(this.screenRam2, 24),
            this.pad(this.screenRam3, 24),
            this.pad(this.screenRam4, 24),
            this.pad(this.screenRam5, 24),
            this.pad(this.screenRam6, 24),
            this.pad(this.screenRam7, 24),
            this.bitmap,
            this.background,
        ];
    }

}
