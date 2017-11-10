import { ColorMap } from '../model/ColorMap';
import { Palette } from '../model/Palette';
import { PixelImage } from '../model/PixelImage';
import { GraphicMode } from '../profiles/GraphicMode';
import { C64Mapper } from './C64Mapper';
import { IC64Image } from './IC64Image';

/**
 * A FLI picture.
 * $3800-$3fff color ram data -> $d800
 * $4000-$5fff screen ram data
 * $6000-      bitmap data
 */
export class FLIPicture extends IC64Image {
  public formatName: string = 'FLI';
  private loadAddress: Uint8Array;
  private colorRam: Uint8Array;
  private screenRam: Uint8Array[];
  private bitmap: Uint8Array;
  private background: Uint8Array;

  public fromPixelImage(pixelImage: PixelImage) {
    this.loadAddress = new Uint8Array(2);
    this.loadAddress[0] = 0;
    this.loadAddress[1] = 0x3c;

    const mapper: C64Mapper = new C64Mapper(pixelImage.mode);

    this.colorRam = mapper.convertColorram(pixelImage, 1);
    this.bitmap = mapper.convertBitmap(pixelImage);

    this.screenRam = [];
    for (let i: number = 0; i < 8; i++) {
      this.screenRam[i] = mapper.convertScreenram(pixelImage, 2, 3, i);
    }

    this.background = new Uint8Array(1);
    this.background[0] = pixelImage.colorMaps[0].get(0, 0);
  }

  /**
   * Convert to a sequence of bytes.
   * @return {Uint8Array} A sequence of 8-bit bytes.
   */
  public toMemoryMap(): Uint8Array[] {
    return [
      this.loadAddress,
      this.pad(this.colorRam, 24),
      this.pad(this.screenRam[0], 24),
      this.pad(this.screenRam[1], 24),
      this.pad(this.screenRam[2], 24),
      this.pad(this.screenRam[3], 24),
      this.pad(this.screenRam[4], 24),
      this.pad(this.screenRam[5], 24),
      this.pad(this.screenRam[6], 24),
      this.pad(this.screenRam[7], 24),
      this.bitmap,
      this.background
    ];
  }
}
