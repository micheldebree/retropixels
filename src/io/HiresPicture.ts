import { ColorMap } from '../model/ColorMap';
import { Palette } from '../model/Palette';
import { PixelImage } from '../model/PixelImage';
import { C64Mapper } from './C64Mapper';

export class HiresPicture {
  public static fromPixelImage(pixelImage: PixelImage): HiresPicture {
    const pic: HiresPicture = new HiresPicture();
    const mapper: C64Mapper = new C64Mapper(pixelImage.mode);

    pic.bitmap = mapper.convertBitmap(pixelImage);
    pic.screenRam = mapper.convertScreenram(pixelImage, 0, 1);

    return pic;
  }

  public bitmap: Uint8Array;
  public screenRam: Uint8Array;

  /**
   * Convert to a sequence of bytes.
   * @return {Uint8Array} A sequence of 8-bit bytes.
   */
  public toMemoryMap(): Uint8Array[] {
    return [new Uint8Array([0, 0x20]), this.bitmap, this.screenRam];
  }
}
