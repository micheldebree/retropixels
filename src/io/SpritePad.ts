import { ColorMap } from '../model/ColorMap';
import { Palette } from '../model/Palette';
import { PixelImage } from '../model/PixelImage';
import { GraphicMode } from '../profiles/GraphicMode';
import { GraphicModes } from '../profiles/GraphicModes';
import { C64Layout } from './C64Layout';
import { IBinaryFormat } from './IBinaryFormat';

export class SpritePad implements IBinaryFormat {
  public formatName: string = 'Sprite Pad';
  public supportedModes: GraphicMode[] = [
    GraphicModes.c64HiresSprites,
    GraphicModes.c64MulticolorSprites,
    GraphicModes.c64ThreecolorSprites,
    GraphicModes.c64TwocolorSprites
  ];

  // $d021, bitmask 00
  private backgroundColor: number;

  // $d025, bitmask 01
  private multiColor1: number;

  // $d026. bitmask 11
  private multiColor2: number;
  // private spriteColor: number;

  // sprite data
  private nrOfSprites: number = 0;
  private sprites: Uint8Array[] = new Array<Uint8Array>();

  public fromPixelImage(pixelImage: PixelImage) {
    const bitmap: Uint8Array = C64Layout.convertBitmap(pixelImage);

    const isMulticolor: boolean =
      pixelImage.mode === GraphicModes.c64MulticolorSprites || pixelImage.mode === GraphicModes.c64ThreecolorSprites;

    this.backgroundColor = pixelImage.colorMaps[0].get(0, 0);
    this.multiColor1 = isMulticolor ? pixelImage.colorMaps[1].get(0, 0) : 0;
    this.multiColor2 = isMulticolor ? pixelImage.colorMaps[2].get(0, 0) : 0;
    // this colormap holds colors for individual sprites
    const spriteColorMapIndex: number = isMulticolor ? 3 : 1;

    // each cell is a sprite
    let byteCounter: number = 0;
    pixelImage.mode.forEachCell(0, (x, y) => {
      this.sprites[this.nrOfSprites] = new Uint8Array(64);
      for (let i = 0; i < 63; i++) {
        this.sprites[this.nrOfSprites][i] = bitmap[byteCounter++];
      }
      // last byte is mode (bit 7: 1 = multi 0 = hires), and sprite color

      const modeFlag: number = isMulticolor ? 0x80 : 0;
      const spriteColor: number = pixelImage.colorMaps[spriteColorMapIndex].get(x, y) & 0x0f;

      this.sprites[this.nrOfSprites][63] = modeFlag | spriteColor;
      this.nrOfSprites++;
    });
  }

  public toMemoryMap(): Uint8Array[] {
    const result: Uint8Array[] = [new Uint8Array([this.backgroundColor, this.multiColor1, this.multiColor2])];
    return result.concat(this.sprites);
  }
}
