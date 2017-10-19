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
export class AFLIPicture extends BinaryFile {

    public static convertBitmap(pixelImage: PixelImage): Uint8Array {
        const bitmap: Uint8Array = new Uint8Array(8000);
        let bitmapIndex: number = 0;

        for (let charY: number = 0; charY < pixelImage.height; charY += 8) {
            for (let charX: number = 0; charX < pixelImage.width; charX += 8) {
                for (let bitmapY: number = 0; bitmapY < 8; bitmapY += 1) {
                    // pack 8 pixels into one byte
                    if (charX > AFLIPicture.FLIBugSize) {
                        bitmap[bitmapIndex] =
                            pixelImage.getPixelIndex(charX, charY + bitmapY) << 7
                            | pixelImage.getPixelIndex(charX + 1, charY + bitmapY) << 6
                            | pixelImage.getPixelIndex(charX + 2, charY + bitmapY) << 5
                            | pixelImage.getPixelIndex(charX + 3, charY + bitmapY) << 4
                            | pixelImage.getPixelIndex(charX + 4, charY + bitmapY) << 3
                            | pixelImage.getPixelIndex(charX + 5, charY + bitmapY) << 2
                            | pixelImage.getPixelIndex(charX + 6, charY + bitmapY) << 1
                            | pixelImage.getPixelIndex(charX + 7, charY + bitmapY);

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
            for (let colorX: number = 0; colorX < lowerColorMap.width; colorX += 8) {
                // pack two colors in one byte
                if (colorX > AFLIPicture.FLIBugSize) {
                    screenRam[colorIndex] =
                        ((upperColorMap.get(colorX, colorY) << 4) & 0xf0)
                        | (lowerColorMap.get(colorX, colorY) & 0x0f);
                }
                colorIndex++;
            }
        }
        return screenRam;
    }

    public static fromPixelImage(pixelImage: PixelImage): AFLIPicture {
        const pic: AFLIPicture = new AFLIPicture();

        pic.loadAddress = new Uint8Array(2);
        pic.loadAddress[0] = 0;
        pic.loadAddress[1] = 0x40;

        pic.bitmap = this.convertBitmap(pixelImage);
        pic.screenRam0 = this.convertScreenram(0, pixelImage.colorMaps[0], pixelImage.colorMaps[1]);
        pic.screenRam1 = this.convertScreenram(1, pixelImage.colorMaps[0], pixelImage.colorMaps[1]);
        pic.screenRam2 = this.convertScreenram(2, pixelImage.colorMaps[0], pixelImage.colorMaps[1]);
        pic.screenRam3 = this.convertScreenram(3, pixelImage.colorMaps[0], pixelImage.colorMaps[1]);
        pic.screenRam4 = this.convertScreenram(4, pixelImage.colorMaps[0], pixelImage.colorMaps[1]);
        pic.screenRam5 = this.convertScreenram(5, pixelImage.colorMaps[0], pixelImage.colorMaps[1]);
        pic.screenRam6 = this.convertScreenram(6, pixelImage.colorMaps[0], pixelImage.colorMaps[1]);
        pic.screenRam7 = this.convertScreenram(7, pixelImage.colorMaps[0], pixelImage.colorMaps[1]);

        return pic;
    }

    private static FLIBugSize: number  = 8;

    public loadAddress: Uint8Array;
    public screenRam0: Uint8Array;
    public screenRam1: Uint8Array;
    public screenRam2: Uint8Array;
    public screenRam3: Uint8Array;
    public screenRam4: Uint8Array;
    public screenRam5: Uint8Array;
    public screenRam6: Uint8Array;
    public screenRam7: Uint8Array;
    public bitmap: Uint8Array;

    /**
     * Convert to a sequence of bytes.
     * @return {Uint8Array} A sequence of 8-bit bytes.
     */
    public toMemoryMap(): Uint8Array[] {
        return [
            this.loadAddress,
            this.pad(this.screenRam0, 24),
            this.pad(this.screenRam1, 24),
            this.pad(this.screenRam2, 24),
            this.pad(this.screenRam3, 24),
            this.pad(this.screenRam4, 24),
            this.pad(this.screenRam5, 24),
            this.pad(this.screenRam6, 24),
            this.pad(this.screenRam7, 24),
            this.bitmap,
        ];
    }

}
