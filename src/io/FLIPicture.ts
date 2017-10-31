import { ColorMap } from '../model/ColorMap';
import { Palette } from '../model/Palette';
import { PixelImage } from '../model/PixelImage';
import { C64Mapper } from './C64Mapper';

/**
 * A FLI picture.
 * $3800-$3fff color ram data -> $d800
 * $4000-$5fff screen ram data
 * $6000-      bitmap data
 */
export class FLIPicture {
  public static fromPixelImage(pixelImage: PixelImage): FLIPicture {
    const pic: FLIPicture = new FLIPicture();

    pic.loadAddress = new Uint8Array(2);
    pic.loadAddress[0] = 0;
    pic.loadAddress[1] = 0x3c;

    const mapper: C64Mapper = new C64Mapper();
    mapper.indexMap = {
      0: 0,
      1: 3,
      2: 2,
      3: 1
    };
    mapper.FLIBugSize = 8;

    pic.colorRam = mapper.convertColorram(pixelImage, 1);
    pic.bitmap = mapper.convertBitmap(pixelImage);

    pic.screenRam = [];
    for (let i: number = 0; i < 8; i++) {
      pic.screenRam[i] = mapper.convertScreenram(pixelImage, 2, 3, i);
    }

    pic.background = new Uint8Array(1);
    pic.background[0] = pixelImage.colorMaps[0].get(0, 0);

    return pic;
  }

  public loadAddress: Uint8Array;
  public colorRam: Uint8Array;
  public screenRam: Uint8Array[];
  public bitmap: Uint8Array;
  public background: Uint8Array;

  /**
   * Convert to a sequence of bytes.
   * @return {Uint8Array} A sequence of 8-bit bytes.
   */
  public toMemoryMap(): Uint8Array[] {
    return [
      this.loadAddress,
      C64Mapper.pad(this.colorRam, 24),
      C64Mapper.pad(this.screenRam[0], 24),
      C64Mapper.pad(this.screenRam[1], 24),
      C64Mapper.pad(this.screenRam[2], 24),
      C64Mapper.pad(this.screenRam[3], 24),
      C64Mapper.pad(this.screenRam[4], 24),
      C64Mapper.pad(this.screenRam[5], 24),
      C64Mapper.pad(this.screenRam[6], 24),
      C64Mapper.pad(this.screenRam[7], 24),
      this.bitmap,
      this.background
    ];
  }
}
