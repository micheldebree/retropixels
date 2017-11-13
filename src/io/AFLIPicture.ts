import { ColorMap } from '../model/ColorMap';
import { Palette } from '../model/Palette';
import { PixelImage } from '../model/PixelImage';
import { GraphicMode } from '../profiles/GraphicMode';
import { C64Format } from './C64Format';
import { C64Mapper } from './C64Mapper';

export class AFLIPicture extends C64Format {
  public formatName: string = 'AFLI';
  private loadAddress: Uint8Array;
  private screenRam: Uint8Array[];
  private bitmap: Uint8Array;

  public fromPixelImage(pixelImage: PixelImage) {

    this.loadAddress = new Uint8Array(2);
    this.loadAddress[0] = 0;
    this.loadAddress[1] = 0x40;

    const mapper: C64Mapper = new C64Mapper(pixelImage.mode);

    this.bitmap = mapper.convertBitmap(pixelImage);
    this.screenRam = [];

    for (let i: number = 0; i < 8; i++) {
      this.screenRam[i] = mapper.convertScreenram(pixelImage, 0, 1, i);
    }
  }

  /**
   * Convert to a sequence of bytes.
   * @return {Uint8Array} A sequence of 8-bit bytes.
   */
  public toMemoryMap(): Uint8Array[] {
    return [
      this.loadAddress,
      this.pad(this.screenRam[0], 24),
      this.pad(this.screenRam[1], 24),
      this.pad(this.screenRam[2], 24),
      this.pad(this.screenRam[3], 24),
      this.pad(this.screenRam[4], 24),
      this.pad(this.screenRam[5], 24),
      this.pad(this.screenRam[6], 24),
      this.pad(this.screenRam[7], 24),
      this.bitmap
    ];
  }
}
