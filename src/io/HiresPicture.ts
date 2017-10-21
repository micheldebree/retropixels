import { ColorMap } from '../model/ColorMap';
import { Palette } from '../model/Palette';
import { PixelImage } from '../model/PixelImage';
import { BinaryFile } from './BinaryFile';
import { C64Mapper } from './C64Mapper';

export class HiresPicture extends BinaryFile {

    public static fromPixelImage(pixelImage: PixelImage): HiresPicture {
        const pic: HiresPicture = new HiresPicture();

        pic.loadAddress = new Uint8Array(2);
        pic.loadAddress[0] = 0;
        pic.loadAddress[1] = 0x20;

        const mapper: C64Mapper = new C64Mapper();

        pic.bitmap = mapper.convertBitmap(pixelImage);
        pic.screenRam = mapper.convertScreenram(pixelImage, 0, 1);

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
