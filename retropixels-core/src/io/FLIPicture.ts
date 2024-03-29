import PixelImage from '../model/PixelImage'
import { convertBitmap, convertScreenram, convertColorram, pad } from './C64Layout'
import IBinaryFormat from './IBinaryFormat'

/**
 * A FLI picture.
 * $3800-$3fff color ram data -> $d800
 * $4000-$5fff screen ram data
 * $6000-      bitmap data
 */
export default class FLIPicture implements IBinaryFormat {
  public formatName = 'fli'

  public defaultExtension = 'fli'

  private loadAddress: Uint8Array

  private colorRam: Uint8Array

  private screenRam: Uint8Array[]

  private bitmap: Uint8Array

  private background: Uint8Array

  public fromPixelImage (pixelImage: PixelImage): void {
    this.loadAddress = new Uint8Array(2)
    this.loadAddress[0] = 0
    this.loadAddress[1] = 0x3c

    this.colorRam = convertColorram(pixelImage, 1)
    this.bitmap = convertBitmap(pixelImage)

    this.screenRam = []
    for (let i = 0; i < 8; i += 1) {
      this.screenRam[i] = convertScreenram(pixelImage, 2, 3, i)
    }

    this.background = new Uint8Array(1)
    this.background[0] = pixelImage.colorMaps[0].getNonEmpty(0, 0)
  }

  /**
   * Convert to a sequence of bytes.
   * @return {Uint8Array} A sequence of 8-bit bytes.
   */
  public toMemoryMap (): Uint8Array[] {
    return [
      this.loadAddress,
      pad(this.colorRam, 24),
      pad(this.screenRam[0], 24),
      pad(this.screenRam[1], 24),
      pad(this.screenRam[2], 24),
      pad(this.screenRam[3], 24),
      pad(this.screenRam[4], 24),
      pad(this.screenRam[5], 24),
      pad(this.screenRam[6], 24),
      pad(this.screenRam[7], 24),
      this.bitmap,
      this.background
    ]
  }
}
