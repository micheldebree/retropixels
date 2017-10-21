import { ColorMap } from '../model/ColorMap';
import { Palette } from '../model/Palette';
import { PixelImage } from '../model/PixelImage';
import { BinaryFile } from './BinaryFile';

export class HiresPicture extends BinaryFile {

    public static convertBitmap(pixelImage: PixelImage): Uint8Array {
        const bitmap: Uint8Array = new Uint8Array(8000);
        let bitmapIndex: number = 0;

        for (let charY: number = 0; charY < pixelImage.height; charY += 8) {
            for (let charX: number = 0; charX < pixelImage.width; charX += 8) {
                for (let bitmapY: number = 0; bitmapY < 8; bitmapY += 1) {
                    // pack 8 pixels into one byte
                    bitmap[bitmapIndex] =
                        pixelImage.getPixelIndex(charX, charY + bitmapY) << 7
                        | pixelImage.getPixelIndex(charX + 1, charY + bitmapY) << 6
                        | pixelImage.getPixelIndex(charX + 2, charY + bitmapY) << 5
                        | pixelImage.getPixelIndex(charX + 3, charY + bitmapY) << 4
                        | pixelImage.getPixelIndex(charX + 4, charY + bitmapY) << 3
                        | pixelImage.getPixelIndex(charX + 5, charY + bitmapY) << 2
                        | pixelImage.getPixelIndex(charX + 6, charY + bitmapY) << 1
                        | pixelImage.getPixelIndex(charX + 7, charY + bitmapY);
                    bitmapIndex += 1;
                }
            }
        }
        return bitmap;
    }

    public static convertScreenram(lowerColorMap: ColorMap, upperColorMap: ColorMap): Uint8Array {
        const screenRam: Uint8Array = new Uint8Array(1000);
        let colorIndex: number = 0;

        for (let colorY: number = 0; colorY < lowerColorMap.height; colorY += 8) {
            for (let colorX: number = 0; colorX < lowerColorMap.width; colorX += 8) {
                // pack two colors in one byte
                screenRam[colorIndex] =
                    ((upperColorMap.get(colorX, colorY) << 4) & 0xf0)
                    | (lowerColorMap.get(colorX, colorY) & 0x0f);
                colorIndex += 1;
            }
        }
        return screenRam;
    }

    public static fromPixelImage(pixelImage: PixelImage): HiresPicture {
        const pic: HiresPicture = new HiresPicture();

        pic.loadAddress = new Uint8Array(2);
        pic.loadAddress[0] = 0;
        pic.loadAddress[1] = 0x20;

        pic.bitmap = this.convertBitmap(pixelImage);
        pic.screenRam = this.convertScreenram(pixelImage.colorMaps[0], pixelImage.colorMaps[1]);

        return pic;
    }

    public loadAddress: Uint8Array;
    public bitmap: Uint8Array;
    public screenRam: Uint8Array;

    /**
     * Convert to a sequence of bytes.
     * @return {Uint8Array} A sequence of 8-bit bytes.
     */
    public toMemoryMap(): Uint8Array[] {
        return [
            this.loadAddress,
            this.bitmap,
            this.screenRam,
        ];
    }
}
