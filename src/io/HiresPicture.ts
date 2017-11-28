import { ColorMap } from '../model/ColorMap';
import { Palette } from '../model/Palette';
import { PixelImage } from '../model/PixelImage';
import { GraphicMode } from '../profiles/GraphicMode';
import { GraphicModes } from '../profiles/GraphicModes';
import { C64Layout } from './C64Layout';
import { IBinaryFormat } from './IBinaryFormat';

export class HiresPicture implements IBinaryFormat {
  public formatName: string = 'Hires';
  public supportedModes: GraphicMode[] = [GraphicModes.c64Hires];

  private bitmap: Uint8Array;
  private screenRam: Uint8Array;

  public fromPixelImage(pixelImage: PixelImage) {
    this.bitmap = C64Layout.convertBitmap(pixelImage);
    this.screenRam = C64Layout.convertScreenram(pixelImage, 0, 1);
  }

  /**
   * Convert to a sequence of bytes.
   * @return {Uint8Array} A sequence of 8-bit bytes.
   */
  public toMemoryMap(): Uint8Array[] {
    return [new Uint8Array([0, 0x20]), this.bitmap, this.screenRam];
  }
}
