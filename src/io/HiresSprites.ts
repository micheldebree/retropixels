import { ColorMap } from '../model/ColorMap';
import { Palette } from '../model/Palette';
import { PixelImage } from '../model/PixelImage';
import { GraphicMode } from '../profiles/GraphicMode';
import { GraphicModes } from '../profiles/GraphicModes';
import { C64Layout } from './C64Layout';
import { IC64Format } from './IC64Format';

export class HiresSprites implements IC64Format {
  public formatName: string = 'HiresSprite';
  public mode: GraphicMode = GraphicModes.c64HiresSprites;

  private bitmap: Uint8Array;
  private spriteColor: number;
  private backgroundColor: number;
  public fromPixelImage(pixelImage: PixelImage): HiresSprites {
    const sprite: HiresSprites = new HiresSprites();

    sprite.bitmap = C64Layout.convertBitmap(pixelImage);
    sprite.spriteColor = pixelImage.colorMaps[0].get(0, 0);
    sprite.backgroundColor = pixelImage.colorMaps[1].get(0, 0);

    return sprite;
  }

  /**
   * Convert to a sequence of bytes.
   * @return {Uint8Array} A sequence of 8-bit bytes.
   */
  public toMemoryMap(): Uint8Array[] {
    return [new Uint8Array([0, 0x20])];
  }
}
