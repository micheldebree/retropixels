import PixelImage from '../model/PixelImage'
import { convertBitmap } from './C64Layout'
import IBinaryFormat from './IBinaryFormat'

export default class SpritePad implements IBinaryFormat {
  public formatName = 'spritepad'

  public defaultExtension = 'spd'

  public supportedModes: string[] = [
    'c64HiresSprites',
    'c64MulticolorSprites',
    'c64ThreecolorSprites',
    'c64TwocolorSprites'
  ]

  // $d021, bitmask 00
  private backgroundColor: number

  // $d025, bitmask 01
  private multiColor1: number

  // $d026. bitmask 11
  private multiColor2: number
  // private spriteColor: number;

  // sprite data
  private nrOfSprites = 0

  private sprites: Uint8Array[] = []

  public fromPixelImage (pixelImage: PixelImage): void {
    const bitmap: Uint8Array = convertBitmap(pixelImage)

    const isMulticolor: boolean = pixelImage.mode.pixelWidth === 2

    this.backgroundColor = pixelImage.colorMaps[0].getNonEmpty(0, 0)
    this.multiColor1 = isMulticolor ? pixelImage.colorMaps[1].getNonEmpty(0, 0) : 0
    this.multiColor2 = isMulticolor ? pixelImage.colorMaps[2].getNonEmpty(0, 0) : 0
    // this colormap holds colors for individual sprites
    const spriteColorMapIndex: number = isMulticolor ? 3 : 1

    // each cell is a sprite
    let byteCounter = 0
    pixelImage.mode.forEachCell(0, (x, y) => {
      this.sprites[this.nrOfSprites] = new Uint8Array(64)
      for (let i = 0; i < 63; i += 1) {
        this.sprites[this.nrOfSprites][i] = bitmap[byteCounter]
        byteCounter += 1
      }
      // last byte is mode (bit 7: 1 = multi 0 = hires), and sprite color

      const modeFlag: number = isMulticolor ? 0x80 : 0
      const spriteColor: number = pixelImage.colorMaps[spriteColorMapIndex].getNonEmpty(x, y) & 0x0f

      this.sprites[this.nrOfSprites][63] = modeFlag | spriteColor
      this.nrOfSprites += 1
    })
  }

  public toMemoryMap (): Uint8Array[] {
    const result: Uint8Array[] = [new Uint8Array([this.backgroundColor, this.multiColor1, this.multiColor2])]
    return result.concat(this.sprites)
  }
}
