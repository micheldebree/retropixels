import { ColorMap } from '../model/ColorMap';
import { Palette } from '../model/Palette';
import { PixelImage } from '../model/PixelImage';
import { GraphicMode } from '../profiles/GraphicMode';
import { C64Format } from './C64Format';
import { C64Mapper } from './C64Mapper';

export class HiresPicture extends C64Format {
  public formatName: string = 'Hires';
  private bitmap: Uint8Array;
  private screenRam: Uint8Array;

  public fromPixelImage(pixelImage: PixelImage) {
    const mapper: C64Mapper = new C64Mapper(pixelImage.mode);
    this.bitmap = mapper.convertBitmap(pixelImage);
    this.screenRam = mapper.convertScreenram(pixelImage, 0, 1);
  }

  /**
   * Convert to a sequence of bytes.
   * @return {Uint8Array} A sequence of 8-bit bytes.
   */
  public toMemoryMap(): Uint8Array[] {
    return [new Uint8Array([0, 0x20]), this.bitmap, this.screenRam];
  }
}
