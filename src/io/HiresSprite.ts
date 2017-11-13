import { ColorMap } from '../model/ColorMap';
import { Palette } from '../model/Palette';
import { PixelImage } from '../model/PixelImage';
import { C64Mapper } from './C64Mapper';

export class HiresSprite {
  public static fromPixelImage(pixelImage: PixelImage): HiresSprite {
    const sprite: HiresSprite = new HiresSprite();
    const mapper: C64Mapper = new C64Mapper(pixelImage.mode);

    sprite.bitmap = mapper.convertBitmap(pixelImage);
    sprite.spriteColor = pixelImage.colorMaps[0].get(0, 0);
    sprite.backgroundColor = pixelImage.colorMaps[1].get(0, 0);

    return sprite;
  }

  public bitmap: Uint8Array;
  public spriteColor: number;
  public backgroundColor: number;

  /**
   * Convert to a sequence of bytes.
   * @return {Uint8Array} A sequence of 8-bit bytes.
   */
  public toMemoryMap(): Uint8Array[] {
    return [new Uint8Array([0, 0x20])];
  }
}
