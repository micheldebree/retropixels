import { PixelImage } from '../model/PixelImage';
import { GraphicMode } from '../profiles/GraphicMode';
import { GraphicModes } from '../profiles/GraphicModes';
import { C64Layout } from './C64Layout';
import { IBinaryFormat } from './IBinaryFormat';

export class AFLIPicture implements IBinaryFormat {
  public formatName: string = 'AFLI';
  public supportedModes: GraphicMode[] = [GraphicModes.c64AFLI];
  private loadAddress: Uint8Array;
  private screenRam: Uint8Array[];
  private bitmap: Uint8Array;

  public fromPixelImage(pixelImage: PixelImage) {
    this.loadAddress = new Uint8Array(2);
    this.loadAddress[0] = 0;
    this.loadAddress[1] = 0x40;

    this.bitmap = C64Layout.convertBitmap(pixelImage);
    this.screenRam = [];

    for (let i: number = 0; i < 8; i++) {
      this.screenRam[i] = C64Layout.convertScreenram(pixelImage, 0, 1, i);
    }
  }

  /**
   * Convert to a sequence of bytes.
   * @return {Uint8Array} A sequence of 8-bit bytes.
   */
  public toMemoryMap(): Uint8Array[] {
    return [
      this.loadAddress,
      C64Layout.pad(this.screenRam[0], 24),
      C64Layout.pad(this.screenRam[1], 24),
      C64Layout.pad(this.screenRam[2], 24),
      C64Layout.pad(this.screenRam[3], 24),
      C64Layout.pad(this.screenRam[4], 24),
      C64Layout.pad(this.screenRam[5], 24),
      C64Layout.pad(this.screenRam[6], 24),
      C64Layout.pad(this.screenRam[7], 24),
      this.bitmap
    ];
  }
}
