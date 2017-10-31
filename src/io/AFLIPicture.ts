import { ColorMap } from '../model/ColorMap';
import { Palette } from '../model/Palette';
import { PixelImage } from '../model/PixelImage';
import { C64Mapper } from './C64Mapper';

export class AFLIPicture {
  private static fromPixelImage(pixelImage: PixelImage): AFLIPicture {
    const pic: AFLIPicture = new AFLIPicture();

    pic.loadAddress = new Uint8Array(2);
    pic.loadAddress[0] = 0;
    pic.loadAddress[1] = 0x40;

    const mapper: C64Mapper = new C64Mapper();
    mapper.FLIBugSize = 8;

    pic.bitmap = mapper.convertBitmap(pixelImage);
    pic.screenRam = [];

    for (let i: number = 0; i < 8; i++) {
      pic.screenRam[i] = mapper.convertScreenram(pixelImage, 0, 1, i);
    }

    return pic;
  }

  private loadAddress: Uint8Array;
  private screenRam: Uint8Array[];
  private bitmap: Uint8Array;

  /**
   * Convert to a sequence of bytes.
   * @return {Uint8Array} A sequence of 8-bit bytes.
   */
  protected toMemoryMap(): Uint8Array[] {
    return [
      this.loadAddress,
      C64Mapper.pad(this.screenRam[0], 24),
      C64Mapper.pad(this.screenRam[1], 24),
      C64Mapper.pad(this.screenRam[2], 24),
      C64Mapper.pad(this.screenRam[3], 24),
      C64Mapper.pad(this.screenRam[4], 24),
      C64Mapper.pad(this.screenRam[5], 24),
      C64Mapper.pad(this.screenRam[6], 24),
      C64Mapper.pad(this.screenRam[7], 24),
      this.bitmap
    ];
  }
}
